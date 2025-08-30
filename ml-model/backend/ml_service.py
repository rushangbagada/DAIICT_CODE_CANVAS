"""
ML Service for Hydrogen Site Recommendations
"""

import os
import time
import joblib
import pandas as pd
import numpy as np
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

# Global ML service instance
ml_service = MLService()
