"""
Pydantic models for API request/response validation
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime

class PolygonRequest(BaseModel):
    """Request model for polygon coordinates"""
    
    polygon_points: List[List[float]] = Field(
        ...,
        description="List of [latitude, longitude] coordinates forming a polygon",
        min_items=3,
        example=[[23.5937, 78.9629], [23.5937, 78.9729], [23.6037, 78.9729], [23.6037, 78.9629]]
    )
    
    @validator('polygon_points')
    def validate_polygon(cls, v):
        """Validate polygon coordinates"""
        if len(v) < 3:
            raise ValueError('Polygon must have at least 3 points')
        
        for point in v:
            if len(point) != 2:
                raise ValueError('Each point must have exactly 2 coordinates (lat, lon)')
            
            lat, lon = point
            if not (-90 <= lat <= 90):
                raise ValueError('Latitude must be between -90 and 90')
            if not (-180 <= lon <= 180):
                raise ValueError('Longitude must be between -180 and 180')
        
        return v

class SiteRecommendation(BaseModel):
    """Model for individual site recommendation"""
    
    lat: float = Field(..., description="Latitude of the site")
    lon: float = Field(..., description="Longitude of the site")
    capacity: Optional[float] = Field(None, description="Hydrogen production capacity (MW)")
    distance_to_renewable: Optional[float] = Field(None, description="Distance to renewable energy (km)")
    demand_index: Optional[float] = Field(None, description="Local demand index (0-100)")
    water_availability: Optional[float] = Field(None, description="Water availability percentage")
    land_cost: Optional[float] = Field(None, description="Land cost (₹k)")
    predicted_score: Optional[float] = Field(None, description="ML-predicted site score")
    site_id: Optional[str] = Field(None, description="Unique site identifier")
    
    # Location information from reverse geocoding
    city: Optional[str] = Field(None, description="City name")
    state: Optional[str] = Field(None, description="State/Province name")
    district: Optional[str] = Field(None, description="District/County name")
    display_name: Optional[str] = Field(None, description="Full address/display name")
    
    class Config:
        schema_extra = {
            "example": {
                "lat": 23.5937,
                "lon": 78.9629,
                "capacity": 120.5,
                "distance_to_renewable": 5.2,
                "demand_index": 85.3,
                "water_availability": 65.8,
                "land_cost": 45.2,
                "predicted_score": 0.87,
                "site_id": "site_0001",
                "city": "Bhopal",
                "state": "Madhya Pradesh",
                "district": "Bhopal",
                "display_name": "Bhopal, Madhya Pradesh, India"
            }
        }

class PolygonAnalysis(BaseModel):
    """Model for polygon analysis results"""
    
    area_km2: str = Field(..., description="Calculated area in square kilometers")
    point_count: int = Field(..., description="Number of polygon points")
    status: str = Field(..., description="Analysis status")
    centroid: Optional[List[float]] = Field(None, description="Polygon centroid [lat, lon]")

class MLResponse(BaseModel):
    """Response model for ML recommendations"""
    
    message: str = Field(..., description="Response message")
    recommended_sites: List[SiteRecommendation] = Field(..., description="List of recommended sites")
    total_sites_found: int = Field(..., description="Total number of sites found in polygon")
    polygon_analysis: PolygonAnalysis = Field(..., description="Polygon analysis results")
    polygon_points_received: List[List[float]] = Field(..., description="Original polygon points")
    processing_time_ms: Optional[float] = Field(None, description="Request processing time in milliseconds")
    model_version: Optional[str] = Field(None, description="ML model version used")
    
    class Config:
        schema_extra = {
            "example": {
                "message": "Candidate sites found in polygon.",
                "recommended_sites": [],
                "total_sites_found": 15,
                "polygon_analysis": {
                    "area_km2": "12.45",
                    "point_count": 4,
                    "status": "sites_found"
                },
                "polygon_points_received": [[23.5937, 78.9629], [23.5937, 78.9729], [23.6037, 78.9729], [23.6037, 78.9629]],
                "processing_time_ms": 45.2,
                "model_version": "1.0.0"
            }
        }

class HealthResponse(BaseModel):
    """Health check response model"""
    
    status: str = Field(..., description="Service status")
    service: str = Field(..., description="Service name")
    timestamp: datetime = Field(..., description="Current timestamp")
    model_status: str = Field(..., description="ML model status")
    dataset_status: str = Field(..., description="Dataset status")
    model_file: str = Field(..., description="Model file path")
    dataset_file: str = Field(..., description="Dataset file path")
    uptime_seconds: Optional[float] = Field(None, description="Service uptime in seconds")

class InfoResponse(BaseModel):
    """API information response model"""
    
    name: str = Field(..., description="API name")
    version: str = Field(..., description="API version")
    description: str = Field(..., description="API description")
    model_info: Dict[str, Any] = Field(..., description="ML model information")
    features: List[str] = Field(..., description="Available features")
    endpoints: List[str] = Field(..., description="Available endpoints")
    documentation_url: str = Field(..., description="API documentation URL")

class ErrorResponse(BaseModel):
    """Error response model"""
    
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")
    timestamp: datetime = Field(..., description="Error timestamp")
    request_id: Optional[str] = Field(None, description="Request identifier for tracking")
