#!/usr/bin/env python3
"""
Test script for the trained PKL model
"""

import joblib
import pandas as pd
import numpy as np
import os

def test_model_loading():
    """Test if the PKL model can be loaded"""
    print("🧪 Testing PKL Model Loading")
    print("=" * 50)
    
    model_file = "hydrogen_site_model.pkl"
    
    if not os.path.exists(model_file):
        print(f"❌ Model file not found: {model_file}")
        print("Please run 'python train_model.py' first to create the model")
        return False
    
    try:
        # Load the model
        print(f"Loading model from: {model_file}")
        model = joblib.load(model_file)
        print("✅ Model loaded successfully!")
        
        # Check model type
        print(f"Model type: {type(model)}")
        
        # Test prediction
        test_features = np.array([[100, 5, 80, 70, 50]])  # Sample data
        prediction = model.predict(test_features)
        print(f"✅ Test prediction successful: {prediction[0]:.4f}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return False

def test_dataset():
    """Test if the dataset exists and can be loaded"""
    print("\n📊 Testing Dataset")
    print("=" * 50)
    
    dataset_file = "hydrogen_sites_generated.csv"
    
    if not os.path.exists(dataset_file):
        print(f"❌ Dataset file not found: {dataset_file}")
        return False
    
    try:
        # Load dataset
        df = pd.read_csv(dataset_file)
        print(f"✅ Dataset loaded successfully!")
        print(f"   Shape: {df.shape}")
        print(f"   Columns: {list(df.columns)}")
        
        # Check required features
        required_features = ["capacity", "distance_to_renewable", "demand_index", "water_availability", "land_cost"]
        missing_features = [f for f in required_features if f not in df.columns]
        
        if missing_features:
            print(f"❌ Missing features: {missing_features}")
            return False
        else:
            print(f"✅ All required features present")
        
        return True
        
    except Exception as e:
        print(f"❌ Error loading dataset: {e}")
        return False

def test_end_to_end():
    """Test complete model prediction workflow"""
    print("\n🔄 Testing End-to-End Workflow")
    print("=" * 50)
    
    try:
        # Load model and dataset
        model = joblib.load("hydrogen_site_model.pkl")
        df = pd.read_csv("hydrogen_sites_generated.csv")
        
        # Take a small sample for testing
        test_data = df.head(10)
        features = ["capacity", "distance_to_renewable", "demand_index", "water_availability", "land_cost"]
        
        # Prepare features
        X = test_data[features].fillna(0)
        
        # Make predictions
        predictions = model.predict(X)
        
        # Add predictions to dataframe
        test_data["predicted_score"] = predictions
        
        print("✅ End-to-end test successful!")
        print(f"   Tested {len(test_data)} samples")
        print(f"   Predictions range: {predictions.min():.4f} to {predictions.max():.4f}")
        
        # Show sample results
        print("\nSample predictions:")
        sample_results = test_data[["lat", "lon", "capacity", "predicted_score"]].head(3)
        print(sample_results.to_string(index=False))
        
        return True
        
    except Exception as e:
        print(f"❌ End-to-end test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🎯 Hydrogen Site Recommender - PKL Model Testing")
    print("=" * 60)
    
    tests = [
        ("Model Loading", test_model_loading),
        ("Dataset", test_dataset),
        ("End-to-End", test_end_to_end)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n🔍 Running {test_name} test...")
        result = test_func()
        results.append((test_name, result))
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 Test Results Summary")
    print("=" * 60)
    
    all_passed = True
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
        if not result:
            all_passed = False
    
    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 All tests passed! Your PKL model is ready to use.")
        print("\nNext steps:")
        print("1. Start FastAPI server: python setup_and_run.py")
        print("2. Test API: python test_api.py")
        print("3. Run demo: python demo.py")
    else:
        print("❌ Some tests failed. Please check the errors above.")
        print("\nTo fix issues:")
        print("1. Run 'python train_model.py' to create the model")
        print("2. Check that all dependencies are installed")
        print("3. Verify file permissions and paths")
    
    return all_passed

if __name__ == "__main__":
    main()
