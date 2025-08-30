#!/usr/bin/env python3
"""
Test script for the Hydrogen Site Recommender FastAPI API
"""

import requests
import json
import time

def test_api():
    """Test the FastAPI endpoints"""
    
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Hydrogen Site Recommender API")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n1. Testing health check...")
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Is it running?")
        return False
    
    # Test 2: Health endpoint
    print("\n2. Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health endpoint passed")
            data = response.json()
            print(f"   Status: {data.get('status')}")
            print(f"   Model: {data.get('model_status')}")
            print(f"   Dataset: {data.get('dataset_status')}")
        else:
            print(f"❌ Health endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health endpoint error: {e}")
    
    # Test 3: Info endpoint
    print("\n3. Testing info endpoint...")
    try:
        response = requests.get(f"{base_url}/info")
        if response.status_code == 200:
            print("✅ Info endpoint passed")
            data = response.json()
            print(f"   Name: {data.get('name')}")
            print(f"   Version: {data.get('version')}")
        else:
            print(f"❌ Info endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Info endpoint error: {e}")
    
    # Test 4: Main recommendation endpoint
    print("\n4. Testing recommendation endpoint...")
    
    # Sample polygon (small area in central India)
    test_polygon = {
        "polygon_points": [
            [23.5937, 78.9629],  # Southwest
            [23.5937, 78.9729],  # Southeast
            [23.6037, 78.9729],  # Northeast
            [23.6037, 78.9629]   # Northwest
        ]
    }
    
    try:
        response = requests.post(
            f"{base_url}/recommend_sites",
            json=test_polygon,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ Recommendation endpoint passed")
            data = response.json()
            print(f"   Message: {data.get('message')}")
            print(f"   Sites found: {data.get('total_sites_found')}")
            print(f"   Recommended sites: {len(data.get('recommended_sites', []))}")
            
            # Show first site details
            if data.get('recommended_sites'):
                first_site = data['recommended_sites'][0]
                print(f"   First site: {first_site.get('lat')}, {first_site.get('lon')}")
                print(f"   Score: {first_site.get('predicted_score')}")
        else:
            print(f"❌ Recommendation endpoint failed: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error: {error_data.get('detail', 'Unknown error')}")
            except:
                print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Recommendation endpoint error: {e}")
    
    # Test 5: Invalid polygon (should fail)
    print("\n5. Testing invalid polygon (should fail)...")
    
    invalid_polygon = {
        "polygon_points": [
            [23.5937, 78.9629]  # Only 1 point (need at least 3)
        ]
    }
    
    try:
        response = requests.post(
            f"{base_url}/recommend_sites",
            json=invalid_polygon,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 400:
            print("✅ Invalid polygon correctly rejected")
            data = response.json()
            print(f"   Error: {data.get('detail', 'Unknown error')}")
        else:
            print(f"❌ Invalid polygon should have been rejected: {response.status_code}")
    except Exception as e:
        print(f"❌ Invalid polygon test error: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 API testing completed!")
    
    return True

if __name__ == "__main__":
    print("Make sure the FastAPI server is running on http://localhost:8000")
    print("You can start it using: python start_server.py")
    print()
    
    input("Press Enter to start testing...")
    
    test_api()
