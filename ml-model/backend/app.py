# After FastAPI app is created
from fastapi import APIRouter

debug_router = APIRouter()

@debug_router.get("/debug-env")
async def debug_env():
    import os
    return {
        "env": {
            "API_KEY": os.environ.get("ML_API_KEY", "NOT SET"),
            "HOST": os.environ.get("HOST", "NOT SET"),
            "PORT": os.environ.get("PORT", "NOT SET"),
            "NODE_ENV": os.environ.get("NODE_ENV", "NOT SET")
        }
    }

app.include_router(debug_router)

# After FastAPI app is created
app.include_router(debug_router)
"""
Main FastAPI application for Hydrogen Site Recommender
"""

import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .middleware import setup_middleware
from .routes import router
from .ml_service import ml_service

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format=settings.LOG_FORMAT
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("🚀 Starting Hydrogen Site Recommender API...")
    
    try:
        # Load dataset
        ml_service.load_dataset()
        logger.info(f"✅ Dataset loaded: {ml_service.dataset_loaded}")
        
        # Load or train model
        if not ml_service.load_model():
            ml_service.train_model_if_needed()
        logger.info(f"✅ Model ready: {ml_service.model_loaded}")
        
        logger.info("🎉 API startup complete!")
        
    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")
        logger.warning("API will start but may not function properly until model is loaded")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down Hydrogen Site Recommender API...")

# Create FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Setup middleware
setup_middleware(app)

# Include routes
app.include_router(router, prefix="/api/v1")

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Global exception: {str(exc)}")
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc),
            "timestamp": time.time(),
            "path": str(request.url)
        }
    )

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Hydrogen Site Recommender API is running",
        "version": settings.API_VERSION,
        "status": "healthy",
        "model_loaded": ml_service.model_loaded,
        "dataset_loaded": ml_service.dataset_loaded,
        "docs": "/docs",
        "health": "/api/v1/health"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    status = ml_service.get_service_status()
    
    return {
        "status": "healthy",
        "service": settings.API_TITLE,
        "timestamp": time.time(),
        "model_status": "loaded" if ml_service.model_loaded else "not_loaded",
        "dataset_status": "loaded" if ml_service.dataset_loaded else "not_loaded",
        "model_file": status["model_file"],
        "dataset_file": status["dataset_file"],
        "uptime_seconds": status["uptime_seconds"]
    }

# Info endpoint
@app.get("/info")
async def get_info():
    """Get API information"""
    model_info = ml_service.get_model_info()
    
    return {
        "name": settings.API_TITLE,
        "version": settings.API_VERSION,
        "description": settings.API_DESCRIPTION,
        "model_info": model_info,
        "features": [
            "Site filtering by geographic polygon",
            "ML-based site scoring and ranking",
            "Hydrogen production capacity optimization",
            "Renewable energy proximity analysis",
            "Demand and infrastructure assessment"
        ],
        "endpoints": [
            "GET / - Health check",
            "GET /health - Health check",
            "GET /info - API information",
            "GET /docs - API documentation",
            "POST /api/v1/recommend_sites - Main recommendation endpoint",
            "GET /api/v1/model/status - Model status",
            "GET /api/v1/dataset/status - Dataset status"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    
    logger.info(f"Starting server on {settings.HOST}:{settings.PORT}")
    uvicorn.run(
        "backend.app:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )
