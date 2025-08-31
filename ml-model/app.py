from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
from shapely.geometry import Point, Polygon
import joblib
import os
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from xgboost import XGBRegressor

# -----------------------------
# FastAPI App Configuration
# -----------------------------
app = FastAPI(
    title="Hydrogen Site Recommender API",
    description="ML-powered API for recommending optimal hydrogen production sites",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173", 
        "http://127.0.0.1:3000", 
        "http://127.0.0.1:5173",
        "https://daiict-code-canvas.vercel.app",
        "https://daiict-code-canvas-git-main-rushangs-projects.vercel.app", 
        "https://daiict-code-canvas-6nj81dxkq-rushangs-projects.vercel.app",
        "https://your-backend-url.onrender.com",  # Replace with your actual backend URL
        "*"  # Allow all origins for now
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Configuration
# -----------------------------
MODEL_FILE = "hydrogen_site_model.pkl"  # Updated to use our trained model
FEATURES = ["capacity", "distance_to_renewable", "demand_index", "water_availability", "land_cost"]
DATA_FILE = "hydrogen_sites_generated.csv"

# Global variables for model and dataset
model = None
df = None

# -----------------------------
# Pydantic Models
# -----------------------------
class PolygonRequest(BaseModel):
    polygon_points: List[List[float]]  # [[lat, lon], ...]

class SiteRecommendation(BaseModel):
    lat: float
    lon: float
    capacity: Optional[float] = None
    distance_to_renewable: Optional[float] = None
    demand_index: Optional[float] = None
    water_availability: Optional[float] = None
    land_cost: Optional[float] = None
    predicted_score: Optional[float] = None
    site_id: Optional[str] = None

class MLResponse(BaseModel):
    message: str
    recommended_sites: List[SiteRecommendation]
    total_sites_found: int
    polygon_analysis: dict
    polygon_points_received: List[List[float]]

# -----------------------------
# Model Loading and Management
# -----------------------------
def load_or_train_model():
    """Load existing trained model or train a new one"""
    global model, df
    
    model_path = os.path.join(os.path.dirname(__file__), MODEL_FILE)
    
    if os.path.exists(model_path):
        try:
            print(f"Loading existing model from: {model_path}")
            model = joblib.load(model_path)
            print("✅ Model loaded successfully")
            return model
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            print("Will train a new model...")
    
    # If no model exists, train a new one
    print("Training new model...")
    try:
        from train_model import main as train_main
        train_main()
        
        # Load the newly trained model
        if os.path.exists(model_path):
            model = joblib.load(model_path)
            print("✅ New model trained and loaded successfully")
            return model
        else:
            raise Exception("Model training failed")
    except Exception as e:
        print(f"❌ Model training failed: {e}")
        raise Exception(f"Could not load or train model: {e}")

def load_or_generate_dataset():
    """Load existing dataset or generate synthetic data"""
    global df
    
    dataset_path = os.path.join(os.path.dirname(__file__), DATA_FILE)
    
    if os.path.exists(dataset_path):
        try:
            df = pd.read_csv(dataset_path)
            print(f"✅ Dataset loaded: {len(df)} sites")
            return df
        except Exception as e:
            print(f"❌ Error loading dataset: {e}")
    
    # If no dataset exists, generate one
    print("Generating synthetic dataset...")
    try:
        from train_model import generate_synthetic_dataset
        df = generate_synthetic_dataset(1000)
        
        # Save dataset
        df.to_csv(dataset_path, index=False)
        print(f"✅ Dataset generated and saved: {len(df)} sites")
        return df
    except Exception as e:
        print(f"❌ Dataset generation failed: {e}")
        raise Exception(f"Could not load or generate dataset: {e}")

# -----------------------------
# Core Functions
# -----------------------------
def filter_by_polygon(df: pd.DataFrame, polygon_points: List[List[float]]) -> pd.DataFrame:
    """Filter sites within the specified polygon"""
    try:
        # Create polygon (shapely uses lon, lat order)
        polygon = Polygon([(lon, lat) for lat, lon in polygon_points])
        
        # Filter sites within polygon
        mask = df.apply(lambda row: polygon.contains(Point(row["lon"], row["lat"])), axis=1)
        filtered_df = df[mask].copy()
        
        return filtered_df
    except Exception as e:
        print(f"Error filtering by polygon: {e}")
        return pd.DataFrame()

def predict_scores(df: pd.DataFrame, model) -> pd.DataFrame:
    """Predict scores for filtered sites using the trained model"""
    try:
        df = df.copy()
        
        # Ensure all required features exist
        for col in FEATURES:
            if col not in df.columns:
                df[col] = 0

        # Handle missing values
        df[FEATURES] = df[FEATURES].fillna(0)
        
        # Prepare features for prediction
        X = df[FEATURES].copy()
        
        # Make predictions using the trained model
        predictions = model.predict(X)
        df["predicted_score"] = predictions
        
        # Sort by predicted score
        df = df.sort_values("predicted_score", ascending=False)
        
        return df
    except Exception as e:
        print(f"Error predicting scores: {e}")
        return df

def get_nearest_sites(df: pd.DataFrame, polygon_points: List[List[float]], n: int = 5) -> pd.DataFrame:
    """Get nearest sites if no sites found in polygon"""
    try:
        # Calculate centroid of polygon
        centroid_lat = sum(point[0] for point in polygon_points) / len(polygon_points)
        centroid_lon = sum(point[1] for point in polygon_points) / len(polygon_points)
        
        # Calculate distances to centroid
        df["distance_to_centroid"] = np.sqrt(
            (df["lat"] - centroid_lat) ** 2 + (df["lon"] - centroid_lon) ** 2
        )
        
        # Return nearest sites
        return df.nsmallest(n, "distance_to_centroid")
    except Exception as e:
        print(f"Error getting nearest sites: {e}")
        return df.head(n)

# -----------------------------
# API Endpoints
# -----------------------------
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Hydrogen Site Recommender API is running",
        "version": "1.0.0",
        "status": "healthy",
        "model_loaded": model is not None,
        "dataset_loaded": df is not None
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "service": "Hydrogen Site Recommender",
        "timestamp": pd.Timestamp.now().isoformat(),
        "model_status": "loaded" if model is not None else "not_loaded",
        "dataset_status": "loaded" if df is not None else "not_loaded",
        "model_file": MODEL_FILE,
        "dataset_file": DATA_FILE
    }

@app.post("/recommend_sites", response_model=MLResponse)
async def recommend_sites(request: PolygonRequest):
    """Main endpoint for site recommendations"""
    global model, df
    
    try:
        # Validate input
        if len(request.polygon_points) < 3:
            raise HTTPException(
                status_code=400, 
                detail="Polygon must have at least 3 points"
            )
        
        # Ensure model and dataset are loaded
        if model is None:
            model = load_or_train_model()
        if df is None:
            df = load_or_generate_dataset()
        
        # Filter sites by polygon
        filtered_sites = filter_by_polygon(df, request.polygon_points)
        
        if filtered_sites.empty:
            # No sites in polygon, return nearest sites
            nearest_sites = get_nearest_sites(df, request.polygon_points)
            
            return MLResponse(
                message="No candidate sites inside polygon. Returning nearest 5 sites.",
                recommended_sites=[
                    SiteRecommendation(
                        lat=site["lat"],
                        lon=site["lon"],
                        capacity=site.get("capacity"),
                        distance_to_renewable=site.get("distance_to_renewable"),
                        demand_index=site.get("demand_index"),
                        water_availability=site.get("water_availability"),
                        land_cost=site.get("land_cost"),
                        predicted_score=site.get("site_score"),
                        site_id=site.get("site_id")
                    ) for _, site in nearest_sites.iterrows()
                ],
                total_sites_found=len(nearest_sites),
                polygon_analysis={
                    "area_km2": "N/A",
                    "point_count": len(request.polygon_points),
                    "status": "no_sites_found"
                },
                polygon_points_received=request.polygon_points
            )
        
        # Predict scores for filtered sites using the trained model
        scored_sites = predict_scores(filtered_sites, model)
        
        # Get top recommendations
        top_sites = scored_sites.head(10)
        
        # Calculate polygon area
        try:
            polygon = Polygon([(lon, lat) for lat, lon in request.polygon_points])
            area_km2 = polygon.area * 111.32 * 111.32  # Rough conversion to km²
        except:
            area_km2 = "N/A"
        
        return MLResponse(
            message="Candidate sites found in polygon.",
            recommended_sites=[
                SiteRecommendation(
                    lat=site["lat"],
                    lon=site["lon"],
                    capacity=site.get("capacity"),
                    distance_to_renewable=site.get("distance_to_renewable"),
                    demand_index=site.get("demand_index"),
                    water_availability=site.get("water_availability"),
                    land_cost=site.get("land_cost"),
                    predicted_score=site.get("predicted_score"),
                    site_id=site.get("site_id")
                ) for _, site in top_sites.iterrows()
            ],
            total_sites_found=len(filtered_sites),
            polygon_analysis={
                "area_km2": f"{area_km2:.2f}" if isinstance(area_km2, (int, float)) else area_km2,
                "point_count": len(request.polygon_points),
                "status": "sites_found"
            },
            polygon_points_received=request.polygon_points
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in recommend_sites: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.get("/info")
async def get_info():
    """Get API information"""
    return {
        "name": "Hydrogen Site Recommender API",
        "version": "1.0.0",
        "description": "ML-powered API for recommending optimal hydrogen production sites",
        "model_info": {
            "type": "XGBoost Regressor",
            "features": FEATURES,
            "file": MODEL_FILE,
            "status": "loaded" if model is not None else "not_loaded"
        },
        "features": [
            "Site filtering by geographic polygon",
            "ML-based site scoring and ranking",
            "Hydrogen production capacity optimization",
            "Renewable energy proximity analysis",
            "Demand and infrastructure assessment"
        ],
        "endpoints": [
            "GET / - Health check",
            "GET /health - Detailed health check",
            "POST /recommend_sites - Main recommendation endpoint",
            "GET /info - API information"
        ]
    }

# -----------------------------
# Startup Event
# -----------------------------
@app.on_event("startup")
async def startup_event():
    """Initialize data and model on startup"""
    global model, df
    
    print("🚀 Starting Hydrogen Site Recommender API...")
    
    try:
        # Load dataset
        df = load_or_generate_dataset()
        print(f"✅ Dataset loaded: {len(df)} sites")
        
        # Load or train model
        model = load_or_train_model()
        print("✅ Model ready")
        
        print("🎉 API startup complete!")
        
    except Exception as e:
        print(f"❌ Startup failed: {e}")
        print("API will start but may not function properly until model is loaded")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
