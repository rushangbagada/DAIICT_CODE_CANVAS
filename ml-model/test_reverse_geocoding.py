#!/usr/bin/env python3
"""
Test script for reverse geocoding functionality
"""

import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from ml_service import MLService

def test_reverse_geocoding():
    """Test reverse geocoding with sample coordinates"""
    
    # Initialize ML service
    ml_service = MLService()
    
    # Test coordinates (Bhopal, Madhya Pradesh)
    test_coordinates = [
        (23.5937, 78.9629),  # Bhopal
        (19.0760, 72.8777),  # Mumbai
        (28.7041, 77.1025),  # Delhi
        (12.9716, 77.5946),  # Bangalore
        (22.5726, 88.3639),  # Kolkata
    ]
    
    print("🧪 Testing Reverse Geocoding...")
    print("=" * 50)
    
    for lat, lon in test_coordinates:
        print(f"\n📍 Coordinates: {lat}, {lon}")
        
        try:
            location_info = ml_service.reverse_geocode(lat, lon)
            
            print(f"   City: {location_info['city']}")
            print(f"   State: {location_info['state']}")
            print(f"   District: {location_info['district']}")
            print(f"   Full Address: {location_info['display_name']}")
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
        
        print("-" * 30)
    
    print("\n✅ Reverse geocoding test completed!")

if __name__ == "__main__":
    test_reverse_geocoding()
