"""
API routes for Hydrogen Site Recommender
"""

import time
from typing import List
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse

from .models import (
    PolygonRequest, MLResponse, SiteRecommendation, 
    PolygonAnalysis, HealthResponse, InfoResponse
)
from .ml_service import ml_service
from .config import settings

router = APIRouter()

def get_ml_service():
    """Dependency to get ML service instance"""
    return ml_service

@router.get("/", response_model=dict)
async def root():
    """Root endpoint - Health check"""
    return {
        "message": "Hydrogen Site Recommender API is running",
        "version": settings.API_VERSION,
        "status": "healthy",
        "model_loaded": ml_service.model_loaded,
        "dataset_loaded": ml_service.dataset_loaded
    }

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Detailed health check endpoint"""
    status = ml_service.get_service_status()
    
    return HealthResponse(
        status="healthy",
        service=settings.API_TITLE,
        timestamp=time.time(),
        model_status="loaded" if ml_service.model_loaded else "not_loaded",
        dataset_status="loaded" if ml_service.dataset_loaded else "not_loaded",
        model_file=status["model_file"],
        dataset_file=status["dataset_file"],
        uptime_seconds=status["uptime_seconds"]
    )

@router.get("/info", response_model=InfoResponse)
async def get_info():
    """Get API information"""
    model_info = ml_service.get_model_info()
    
    return InfoResponse(
        name=settings.API_TITLE,
        version=settings.API_VERSION,
        description=settings.API_DESCRIPTION,
        model_info=model_info,
        features=[
            "Site filtering by geographic polygon",
            "ML-based site scoring and ranking",
            "Hydrogen production capacity optimization",
            "Renewable energy proximity analysis",
            "Demand and infrastructure assessment"
        ],
        endpoints=[
            "GET / - Health check",
            "GET /health - Detailed health check",
            "POST /recommend_sites - Main recommendation endpoint",
            "GET /info - API information"
        ],
        documentation_url="/docs"
    )

@router.post("/recommend_sites", response_model=MLResponse)
async def recommend_sites(
    request: PolygonRequest,
    ml_service_instance: MLService = Depends(get_ml_service)
):
    """Main endpoint for site recommendations"""
    
    start_time = time.time()
    
    try:
        # Ensure model and dataset are loaded
        if not ml_service_instance.model_loaded:
            ml_service_instance.load_model()
            if not ml_service_instance.model_loaded:
                ml_service_instance.train_model_if_needed()
        
        if not ml_service_instance.dataset_loaded:
            ml_service_instance.load_dataset()
        
        # Filter sites by polygon
        filtered_sites = ml_service_instance.filter_sites_by_polygon(request.polygon_points)
        
        if filtered_sites.empty:
            # No sites in polygon, return nearest sites
            nearest_sites = ml_service_instance.get_nearest_sites(request.polygon_points)
            
            # Convert to response format
            recommended_sites = [
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
            ]
            
            return MLResponse(
                message="No candidate sites inside polygon. Returning nearest 5 sites.",
                recommended_sites=recommended_sites,
                total_sites_found=len(nearest_sites),
                polygon_analysis=PolygonAnalysis(
                    area_km2=ml_service_instance.calculate_polygon_area(request.polygon_points),
                    point_count=len(request.polygon_points),
                    status="no_sites_found"
                ),
                polygon_points_received=request.polygon_points,
                processing_time_ms=(time.time() - start_time) * 1000,
                model_version=settings.API_VERSION
            )
        
        # Predict scores for filtered sites
        scored_sites = ml_service_instance.predict_scores(filtered_sites)
        
        # Get top recommendations
        top_sites = scored_sites.head(settings.MAX_RECOMMENDATIONS)
        
        # Convert to response format
        recommended_sites = [
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
        ]
        
        # Calculate polygon area
        area_km2 = ml_service_instance.calculate_polygon_area(request.polygon_points)
        
        return MLResponse(
            message="Candidate sites found in polygon.",
            recommended_sites=recommended_sites,
            total_sites_found=len(filtered_sites),
            polygon_analysis=PolygonAnalysis(
                area_km2=area_km2,
                point_count=len(request.polygon_points),
                status="sites_found"
            ),
            polygon_points_received=request.polygon_points,
            processing_time_ms=(time.time() - start_time) * 1000,
            model_version=settings.API_VERSION
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/model/status")
async def get_model_status():
    """Get ML model status"""
    return ml_service.get_service_status()

@router.get("/model/info")
async def get_model_info():
    """Get ML model information"""
    return ml_service.get_model_info()

@router.post("/model/reload")
async def reload_model():
    """Reload the ML model"""
    try:
        success = ml_service.load_model()
        if success:
            return {"message": "Model reloaded successfully", "status": "success"}
        else:
            raise HTTPException(status_code=500, detail="Failed to reload model")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reloading model: {str(e)}")

@router.get("/dataset/status")
async def get_dataset_status():
    """Get dataset status"""
    return {
        "loaded": ml_service.dataset_loaded,
        "total_sites": len(ml_service.dataset) if ml_service.dataset_loaded else 0,
        "file": settings.DATASET_FILE
    }

@router.get("/dataset/sample")
async def get_dataset_sample(limit: int = 5):
    """Get sample data from dataset"""
    if not ml_service.dataset_loaded:
        raise HTTPException(status_code=400, detail="Dataset not loaded")
    
    sample_data = ml_service.dataset.head(limit)
    return {
        "sample_data": sample_data.to_dict(orient="records"),
        "total_sites": len(ml_service.dataset),
        "sample_size": len(sample_data)
    }
