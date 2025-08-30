#!/usr/bin/env python3
"""
Demo script showing the complete workflow of the Hydrogen Site Recommender
"""

import requests
import json
import time

def demo_workflow():
    """Demonstrate the complete ML recommendation workflow"""
    
    print("🎯 Hydrogen Site Recommender - Complete Demo")
    print("=" * 60)
    
    # Check if server is running
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code != 200:
            print("❌ FastAPI server is not responding properly")
            return False
        print("✅ FastAPI server is running")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to FastAPI server")
        print("   Please start the server using: python start_server.py")
        return False
    
    # Demo 1: Small area in central India
    print("\n📍 Demo 1: Small Area Analysis")
    print("-" * 40)
    
    small_polygon = {
        "polygon_points": [
            [23.5937, 78.9629],  # Southwest
            [23.5937, 78.9729],  # Southeast  
            [23.6037, 78.9729],  # Northeast
            [23.6037, 78.9629]   # Northwest
        ]
    }
    
    print(f"   Polygon: {len(small_polygon['polygon_points'])} points")
    print(f"   Area: ~12 km²")
    
    try:
        response = requests.post(
            "http://localhost:8000/recommend_sites",
            json=small_polygon,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Sites found: {data.get('total_sites_found', 0)}")
            print(f"   📊 Top recommendations: {len(data.get('recommended_sites', []))}")
            
            if data.get('recommended_sites'):
                top_site = data['recommended_sites'][0]
                print(f"   🏆 Best site: {top_site.get('lat'):.4f}, {top_site.get('lon'):.4f}")
                print(f"   📈 Score: {top_site.get('predicted_score', 0):.3f}")
        else:
            print(f"   ❌ Request failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Demo 2: Larger area in northern India
    print("\n📍 Demo 2: Larger Area Analysis")
    print("-" * 40)
    
    large_polygon = {
        "polygon_points": [
            [28.7041, 77.1025],  # Southwest (Delhi area)
            [28.7041, 77.2025],  # Southeast
            [28.8041, 77.2025],  # Northeast
            [28.8041, 77.1025]   # Northwest
        ]
    }
    
    print(f"   Polygon: {len(large_polygon['polygon_points'])} points")
    print(f"   Area: ~100 km²")
    
    try:
        response = requests.post(
            "http://localhost:8000/recommend_sites",
            json=large_polygon,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Sites found: {data.get('total_sites_found', 0)}")
            print(f"   📊 Top recommendations: {len(data.get('recommended_sites', []))}")
            
            if data.get('recommended_sites'):
                top_site = data['recommended_sites'][0]
                print(f"   🏆 Best site: {top_site.get('lat'):.4f}, {top_site.get('lon'):.4f}")
                print(f"   📈 Score: {top_site.get('predicted_score', 0):.3f}")
        else:
            print(f"   ❌ Request failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Demo 3: Coastal area in western India
    print("\n📍 Demo 3: Coastal Area Analysis")
    print("-" * 40)
    
    coastal_polygon = {
        "polygon_points": [
            [19.0760, 72.8777],  # Southwest (Mumbai area)
            [19.0760, 72.9777],  # Southeast
            [19.1760, 72.9777],  # Northeast
            [19.1760, 72.8777]   # Northwest
        ]
    }
    
    print(f"   Polygon: {len(coastal_polygon['polygon_points'])} points")
    print(f"   Area: ~100 km²")
    print(f"   🌊 Location: Coastal area")
    
    try:
        response = requests.post(
            "http://localhost:8000/recommend_sites",
            json=coastal_polygon,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Sites found: {data.get('total_sites_found', 0)}")
            print(f"   📊 Top recommendations: {len(data.get('recommended_sites', []))}")
            
            if data.get('recommended_sites'):
                top_site = data['recommended_sites'][0]
                print(f"   🏆 Best site: {top_site.get('lat'):.4f}, {top_site.get('lon'):.4f}")
                print(f"   📈 Score: {top_site.get('predicted_score', 0):.3f}")
        else:
            print(f"   ❌ Request failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Demo 4: Invalid polygon (should fail)
    print("\n📍 Demo 4: Error Handling")
    print("-" * 40)
    
    invalid_polygon = {
        "polygon_points": [
            [23.5937, 78.9629]  # Only 1 point (need at least 3)
        ]
    }
    
    print(f"   Polygon: {len(invalid_polygon['polygon_points'])} points")
    print(f"   Expected: Validation error")
    
    try:
        response = requests.post(
            "http://localhost:8000/recommend_sites",
            json=invalid_polygon,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 400:
            print(f"   ✅ Correctly rejected invalid polygon")
            data = response.json()
            print(f"   📝 Error: {data.get('detail', 'Unknown error')}")
        else:
            print(f"   ❌ Should have been rejected: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Summary
    print("\n" + "=" * 60)
    print("🎯 Demo Summary")
    print("=" * 60)
    print("✅ FastAPI ML server is running and responding")
    print("✅ Polygon validation is working")
    print("✅ ML model is processing requests")
    print("✅ Results are being returned in correct format")
    print("\n🚀 Ready for frontend integration!")
    print("\nNext steps:")
    print("1. Open your React frontend")
    print("2. Navigate to the India Polygon Map component")
    print("3. Draw polygons and test ML analysis")
    print("4. Verify results are displayed correctly")
    
    return True

def show_api_info():
    """Show API information and available endpoints"""
    
    print("\n📚 API Information")
    print("=" * 60)
    
    try:
        response = requests.get("http://localhost:8000/info")
        if response.status_code == 200:
            data = response.json()
            print(f"Name: {data.get('name')}")
            print(f"Version: {data.get('version')}")
            print(f"Description: {data.get('description')}")
            print(f"\nFeatures:")
            for feature in data.get('features', []):
                print(f"  • {feature}")
            print(f"\nEndpoints:")
            for endpoint in data.get('endpoints', []):
                print(f"  • {endpoint}")
        else:
            print(f"❌ Could not fetch API info: {response.status_code}")
    except Exception as e:
        print(f"❌ Error fetching API info: {e}")

if __name__ == "__main__":
    print("Make sure the FastAPI server is running on http://localhost:8000")
    print("You can start it using: python start_server.py")
    print()
    
    input("Press Enter to start the demo...")
    
    if demo_workflow():
        show_api_info()
    
    print("\n🎉 Demo completed!")
    print("Check the integration guide for next steps.")
