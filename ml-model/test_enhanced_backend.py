#!/usr/bin/env python3
"""
Test script for the Enhanced Hydrogen Site Recommender Backend
"""

import requests
import json
import time
from typing import Dict, Any

class EnhancedBackendTester:
    """Test class for the enhanced backend"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.test_results = []
        
    def test_endpoint(self, method: str, endpoint: str, expected_status: int = 200, 
                      data: Dict[str, Any] = None, description: str = "") -> bool:
        """Test a single endpoint"""
        try:
            url = f"{self.base_url}{endpoint}"
            
            if method.upper() == "GET":
                response = requests.get(url)
            elif method.upper() == "POST":
                response = requests.post(url, json=data)
            else:
                print(f"❌ Unsupported method: {method}")
                return False
            
            success = response.status_code == expected_status
            
            if success:
                print(f"✅ {description or endpoint}: {response.status_code}")
                if response.status_code == 200:
                    try:
                        result = response.json()
                        if "processing_time_ms" in result:
                            print(f"   ⏱️  Processing time: {result['processing_time_ms']:.2f}ms")
                    except:
                        pass
            else:
                print(f"❌ {description or endpoint}: Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data.get('detail', 'Unknown error')}")
                except:
                    print(f"   Error: {response.text}")
            
            self.test_results.append({
                "endpoint": endpoint,
                "method": method,
                "expected": expected_status,
                "actual": response.status_code,
                "success": success,
                "description": description
            })
            
            return success
            
        except requests.exceptions.ConnectionError:
            print(f"❌ {description or endpoint}: Cannot connect to server")
            self.test_results.append({
                "endpoint": endpoint,
                "method": method,
                "expected": expected_status,
                "actual": "Connection Error",
                "success": False,
                "description": description
            })
            return False
        except Exception as e:
            print(f"❌ {description or endpoint}: Error - {e}")
            self.test_results.append({
                "endpoint": endpoint,
                "method": method,
                "expected": expected_status,
                "actual": f"Error: {e}",
                "success": False,
                "description": description
            })
            return False
    
    def test_basic_endpoints(self) -> bool:
        """Test basic API endpoints"""
        print("\n🔍 Testing Basic Endpoints")
        print("=" * 50)
        
        tests = [
            ("GET", "/", 200, None, "Root endpoint"),
            ("GET", "/health", 200, None, "Health check"),
            ("GET", "/info", 200, None, "API information"),
            ("GET", "/docs", 200, None, "API documentation"),
        ]
        
        all_passed = True
        for method, endpoint, expected, data, description in tests:
            if not self.test_endpoint(method, endpoint, expected, data, description):
                all_passed = False
        
        return all_passed
    
    def test_api_v1_endpoints(self) -> bool:
        """Test API v1 endpoints"""
        print("\n🔍 Testing API v1 Endpoints")
        print("=" * 50)
        
        tests = [
            ("GET", "/api/v1/", 200, None, "API v1 root"),
            ("GET", "/api/v1/health", 200, None, "API v1 health check"),
            ("GET", "/api/v1/info", 200, None, "API v1 info"),
            ("GET", "/api/v1/model/status", 200, None, "Model status"),
            ("GET", "/api/v1/model/info", 200, None, "Model info"),
            ("GET", "/api/v1/dataset/status", 200, None, "Dataset status"),
            ("GET", "/api/v1/dataset/sample", 200, None, "Dataset sample"),
        ]
        
        all_passed = True
        for method, endpoint, expected, data, description in tests:
            if not self.test_endpoint(method, endpoint, expected, data, description):
                all_passed = False
        
        return all_passed
    
    def test_ml_recommendations(self) -> bool:
        """Test ML recommendation endpoint"""
        print("\n🔍 Testing ML Recommendations")
        print("=" * 50)
        
        # Test 1: Valid polygon
        valid_polygon = {
            "polygon_points": [
                [23.5937, 78.9629],
                [23.5937, 78.9729],
                [23.6037, 78.9729],
                [23.6037, 78.9629]
            ]
        }
        
        success1 = self.test_endpoint(
            "POST", "/api/v1/recommend_sites", 200, 
            valid_polygon, "Valid polygon recommendation"
        )
        
        # Test 2: Invalid polygon (too few points)
        invalid_polygon = {
            "polygon_points": [
                [23.5937, 78.9629],
                [23.5937, 78.9729]
            ]
        }
        
        success2 = self.test_endpoint(
            "POST", "/api/v1/recommend_sites", 422, 
            invalid_polygon, "Invalid polygon (should fail validation)"
        )
        
        # Test 3: Invalid coordinates
        invalid_coords = {
            "polygon_points": [
                [23.5937, 78.9629],
                [23.5937, 78.9729],
                [200.0, 300.0]  # Invalid coordinates
            ]
        }
        
        success3 = self.test_endpoint(
            "POST", "/api/v1/recommend_sites", 422, 
            invalid_coords, "Invalid coordinates (should fail validation)"
        )
        
        return success1 and success2 and success3
    
    def test_model_management(self) -> bool:
        """Test model management endpoints"""
        print("\n🔍 Testing Model Management")
        print("=" * 50)
        
        # Test model reload
        success = self.test_endpoint(
            "POST", "/api/v1/model/reload", 200, 
            None, "Model reload"
        )
        
        return success
    
    def test_performance_metrics(self) -> bool:
        """Test performance metrics in responses"""
        print("\n🔍 Testing Performance Metrics")
        print("=" * 50)
        
        try:
            # Test recommendation with timing
            test_polygon = {
                "polygon_points": [
                    [23.5937, 78.9629],
                    [23.5937, 78.9729],
                    [23.6037, 78.9729],
                    [23.6037, 78.9629]
                ]
            }
            
            response = requests.post(f"{self.base_url}/api/v1/recommend_sites", json=test_polygon)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check for performance metrics
                if "processing_time_ms" in result:
                    print(f"✅ Processing time: {result['processing_time_ms']:.2f}ms")
                    
                    # Check if processing time is reasonable (< 1 second)
                    if result['processing_time_ms'] < 1000:
                        print("✅ Processing time is reasonable")
                        return True
                    else:
                        print("⚠️  Processing time is slow")
                        return False
                else:
                    print("❌ No processing time in response")
                    return False
            else:
                print(f"❌ Request failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Performance test failed: {e}")
            return False
    
    def run_all_tests(self) -> bool:
        """Run all tests"""
        print("🎯 Enhanced Hydrogen Site Recommender Backend - Testing")
        print("=" * 60)
        
        # Check if server is running
        try:
            response = requests.get(f"{self.base_url}/health")
            if response.status_code != 200:
                print("❌ Server is not responding properly")
                return False
            print("✅ Server is running and responding")
        except requests.exceptions.ConnectionError:
            print("❌ Cannot connect to server. Is it running?")
            print("Start the server using: python start_enhanced_backend.py")
            return False
        
        # Run all test suites
        test_suites = [
            ("Basic Endpoints", self.test_basic_endpoints),
            ("API v1 Endpoints", self.test_api_v1_endpoints),
            ("ML Recommendations", self.test_ml_recommendations),
            ("Model Management", self.test_model_management),
            ("Performance Metrics", self.test_performance_metrics),
        ]
        
        all_passed = True
        for suite_name, test_func in test_suites:
            print(f"\n🧪 Running {suite_name} Tests...")
            if not test_func():
                all_passed = False
        
        # Print summary
        print("\n" + "=" * 60)
        print("📋 Test Results Summary")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if all_passed:
            print("\n🎉 All tests passed! Your enhanced backend is working perfectly.")
            print("\nNext steps:")
            print("1. Your MERN frontend can now use the enhanced API")
            print("2. Check the API documentation at /docs")
            print("3. Monitor performance with the new metrics")
        else:
            print("\n❌ Some tests failed. Check the errors above.")
            print("\nTo fix issues:")
            print("1. Ensure the server is running")
            print("2. Check server logs for errors")
            print("3. Verify all dependencies are installed")
        
        return all_passed

def main():
    """Main test function"""
    print("Make sure the enhanced backend is running on http://localhost:8000")
    print("You can start it using: python start_enhanced_backend.py")
    print()
    
    input("Press Enter to start testing...")
    
    tester = EnhancedBackendTester()
    tester.run_all_tests()

if __name__ == "__main__":
    main()
