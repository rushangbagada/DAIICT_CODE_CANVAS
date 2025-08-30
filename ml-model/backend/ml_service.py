"""
ML Service for Hydrogen Site Recommendations
"""

import os
import time
import joblib
import pandas as pd
import numpy as np
import requests
from shapely.geometry import Point, Polygon
from typing import List, Tuple, Optional, Dict, Any
import logging

from .config import settings

# Configure logging
logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL), format=settings.LOG_FORMAT)
logger = logging.getLogger(__name__)

class MLService:
    """Service class for ML model operations"""
    
    def __init__(self):
        self.model = None
        self.dataset = None
        self.model_loaded = False
        self.dataset_loaded = False
        self.startup_time = time.time()
        
    def load_model(self) -> bool:
        """Load the trained ML model"""
        try:
            model_path = os.path.join(os.path.dirname(__file__), "..", settings.MODEL_FILE)
            
            if not os.path.exists(model_path):
                logger.warning(f"Model file not found: {model_path}")
                return False
                
            logger.info(f"Loading model from: {model_path}")
            self.model = joblib.load(model_path)
            self.model_loaded = True
            logger.info("✅ Model loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error loading model: {e}")
            self.model_loaded = False
            return False
    
    def load_dataset(self) -> bool:
        """Load the hydrogen sites dataset"""
        try:
            dataset_path = os.path.join(os.path.dirname(__file__), "..", settings.DATASET_FILE)
            
            if not os.path.exists(dataset_path):
                logger.warning(f"Dataset file not found: {dataset_path}")
                return False
                
            logger.info(f"Loading dataset from: {dataset_path}")
            self.dataset = pd.read_csv(dataset_path)
            self.dataset_loaded = True
            logger.info(f"✅ Dataset loaded: {len(self.dataset)} sites")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error loading dataset: {e}")
            self.dataset_loaded = False
            return False
    
    def train_model_if_needed(self) -> bool:
        """Train model if it doesn't exist"""
        try:
            if self.model_loaded:
                return True
                
            logger.info("Training new model...")
            from ..train_model import main as train_main
            train_main()
            
            # Try to load the newly trained model
            return self.load_model()
            
        except Exception as e:
            logger.error(f"❌ Model training failed: {e}")
            return False
    
    def filter_sites_by_polygon(self, polygon_points: List[List[float]]) -> pd.DataFrame:
        """Filter sites within the specified polygon"""
        try:
            if not self.dataset_loaded:
                logger.error("Dataset not loaded")
                return pd.DataFrame()
            
            # Create polygon (shapely uses lon, lat order)
            polygon = Polygon([(lon, lat) for lat, lon in polygon_points])
            
            # Filter sites within polygon
            mask = self.dataset.apply(
                lambda row: polygon.contains(Point(row["lon"], row["lat"])), 
                axis=1
            )
            filtered_df = self.dataset[mask].copy()
            
            logger.info(f"Found {len(filtered_df)} sites in polygon")
            return filtered_df
            
        except Exception as e:
            logger.error(f"Error filtering by polygon: {e}")
            return pd.DataFrame()
    
    def predict_scores(self, df: pd.DataFrame) -> pd.DataFrame:
        """Predict scores for filtered sites using the trained model"""
        try:
            if not self.model_loaded:
                logger.error("Model not loaded")
                return df
                
            df = df.copy()
            
            # Ensure all required features exist
            for col in settings.FEATURES:
                if col not in df.columns:
                    df[col] = 0
            
            # Handle missing values
            df[settings.FEATURES] = df[settings.FEATURES].fillna(0)
            
            # Prepare features for prediction
            X = df[settings.FEATURES].copy()
            
            # Make predictions using the trained model
            predictions = self.model.predict(X)
            df["predicted_score"] = predictions
            
            # Sort by predicted score
            df = df.sort_values("predicted_score", ascending=False)
            
            logger.info(f"Predictions completed for {len(df)} sites")
            return df
            
        except Exception as e:
            logger.error(f"Error predicting scores: {e}")
            return df
    
    def get_nearest_sites(self, polygon_points: List[List[float]], n: int = 5) -> pd.DataFrame:
        """Get nearest sites if no sites found in polygon"""
        try:
            if not self.dataset_loaded:
                return pd.DataFrame()
                
            # Calculate centroid of polygon
            centroid_lat = sum(point[0] for point in polygon_points) / len(polygon_points)
            centroid_lon = sum(point[1] for point in polygon_points) / len(polygon_points)
            
            # Calculate distances to centroid
            self.dataset["distance_to_centroid"] = np.sqrt(
                (self.dataset["lat"] - centroid_lat) ** 2 + 
                (self.dataset["lon"] - centroid_lon) ** 2
            )
            
            # Return nearest sites
            nearest_sites = self.dataset.nsmallest(n, "distance_to_centroid")
            logger.info(f"Returning {len(nearest_sites)} nearest sites")
            return nearest_sites
            
        except Exception as e:
            logger.error(f"Error getting nearest sites: {e}")
            return self.dataset.head(n) if self.dataset_loaded else pd.DataFrame()
    
    def calculate_polygon_area(self, polygon_points: List[List[float]]) -> str:
        """Calculate polygon area in square kilometers"""
        try:
            polygon = Polygon([(lon, lat) for lat, lon in polygon_points])
            area_km2 = polygon.area * 111.32 * 111.32  # Rough conversion to km²
            return f"{area_km2:.2f}"
        except:
            return "N/A"
    
    def get_service_status(self) -> Dict[str, Any]:
        """Get current service status"""
        uptime = time.time() - self.startup_time
        
        return {
            "model_loaded": self.model_loaded,
            "dataset_loaded": self.dataset_loaded,
            "model_file": settings.MODEL_FILE,
            "dataset_file": settings.DATASET_FILE,
            "uptime_seconds": uptime,
            "total_sites": len(self.dataset) if self.dataset_loaded else 0
        }
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get ML model information"""
        return {
            "type": "XGBoost Regressor",
            "features": settings.FEATURES,
            "file": settings.MODEL_FILE,
            "status": "loaded" if self.model_loaded else "not_loaded",
            "parameters": settings.MODEL_PARAMS,
            "geographic_bounds": settings.INDIA_BOUNDS
        }

    def reverse_geocode(self, lat: float, lon: float) -> Dict[str, str]:
        """
        Convert coordinates to location name using OpenStreetMap Nominatim
        Returns: {"display_name": "Full address", "city": "City name", "state": "State name"}
        """
        try:
            # Nominatim API endpoint
            url = "https://nominatim.openstreetmap.org/reverse"
            params = {
                "lat": lat,
                "lon": lon,
                "format": "json",
                "addressdetails": 1,
                "accept-language": "en"
            }
            
            # Add user agent header (required by Nominatim)
            headers = {
                "User-Agent": "HydrogenSiteRecommender/1.0"
            }
            
            response = requests.get(url, params=params, headers=headers, timeout=settings.GEOCODING_TIMEOUT)
            response.raise_for_status()
            
            data = response.json()
            
            # Extract location information
            address = data.get("address", {})
            
            location_info = {
                "display_name": data.get("display_name", "Unknown location"),
                "city": address.get("city") or address.get("town") or address.get("village") or "Unknown city",
                "state": address.get("state") or "Unknown state",
                "country": address.get("country") or "Unknown country",
                "postcode": address.get("postcode") or "",
                "district": address.get("district") or address.get("county") or ""
            }
            
            logger.info(f"Reverse geocoded {lat}, {lon} to {location_info['city']}, {location_info['state']}")
            return location_info
            
        except Exception as e:
            logger.warning(f"Reverse geocoding failed for {lat}, {lon}: {e}")
            return {
                "display_name": f"Location at {lat:.4f}, {lon:.4f}",
                "city": "Unknown city",
                "state": "Unknown state",
                "country": "Unknown country",
                "postcode": "",
                "district": ""
            }
    
    def add_location_names_to_sites(self, sites_df: pd.DataFrame) -> pd.DataFrame:
        """
        Add location names to sites dataframe using reverse geocoding
        """
        try:
            if not settings.ENABLE_REVERSE_GEOCODING:
                logger.info("Reverse geocoding is disabled in configuration")
                return sites_df
                
            if sites_df.empty:
                return sites_df
                
            sites_df = sites_df.copy()
            
            # Add location columns
            sites_df["city"] = ""
            sites_df["state"] = ""
            sites_df["display_name"] = ""
            sites_df["district"] = ""
            
            # Process each site (with rate limiting to respect Nominatim's terms)
            for idx, row in sites_df.iterrows():
                lat, lon = row["lat"], row["lon"]
                
                # Get location info
                location_info = self.reverse_geocode(lat, lon)
                
                # Update dataframe
                sites_df.at[idx, "city"] = location_info["city"]
                sites_df.at[idx, "state"] = location_info["state"]
                sites_df.at[idx, "display_name"] = location_info["display_name"]
                sites_df.at[idx, "district"] = location_info["district"]
                
                # Rate limiting: Nominatim allows max 1 request per second
                time.sleep(settings.GEOCODING_RATE_LIMIT)
            
            logger.info(f"Added location names to {len(sites_df)} sites")
            return sites_df
            
        except Exception as e:
            logger.error(f"Error adding location names: {e}")
            return sites_df

# Global ML service instance
ml_service = MLService()
