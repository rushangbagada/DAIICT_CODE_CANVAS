"""
Configuration settings for the Hydrogen Site Recommender Backend
"""

import os
from typing import List

class Settings:
    """Application settings and configuration"""
    
    # API Configuration
    API_TITLE: str = "Hydrogen Site Recommender API"
    API_DESCRIPTION: str = "ML-powered API for recommending optimal hydrogen production sites"
    API_VERSION: str = "1.0.0"
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",    # React default
        "http://localhost:5173",    # Vite default
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://localhost:5000",    # Express backend
        "https://daiict-code-canvas-227d-k36yxmdes-rushangbagadas-projects.vercel.app",  # Old Vercel URL
        "https://daiict-code-canvas-kx5kd1ckv-rushangbagadas-projects.vercel.app",  # Previous Vercel URL
        "https://daiict-code-canvas-picci8dnx-rushangbagadas-projects.vercel.app",  # Latest Vercel URL
    ]
    
    # ML Model Configuration
    MODEL_FILE: str = "hydrogen_site_model.pkl"
    DATASET_FILE: str = "hydrogen_sites_generated.csv"
    FEATURES: List[str] = [
        "capacity",
        "distance_to_renewable", 
        "demand_index",
        "water_availability",
        "land_cost"
    ]
    
    # Geographic Configuration
    INDIA_BOUNDS = {
        "lat_min": 8.0,
        "lat_max": 37.0,
        "lon_min": 68.0,
        "lon_max": 97.0
    }
    
    # ML Model Parameters
    MODEL_PARAMS = {
        "n_estimators": 200,
        "learning_rate": 0.1,
        "max_depth": 6,
        "subsample": 0.8,
        "colsample_bytree": 0.8,
        "random_state": 42
    }
    
    # API Response Configuration
    MAX_RECOMMENDATIONS: int = 10
    MIN_POLYGON_POINTS: int = 3
    
    # Reverse Geocoding Configuration
    ENABLE_REVERSE_GEOCODING: bool = True
    GEOCODING_TIMEOUT: int = 10  # seconds
    GEOCODING_RATE_LIMIT: float = 1.2  # seconds between requests
    
    # Logging Configuration
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

# Global settings instance
settings = Settings()
