#!/usr/bin/env python3
"""
Complete setup and run script for Hydrogen Site Recommender
This script will:
1. Train the ML model and save as PKL file
2. Start the FastAPI server
"""

import os
import sys
import subprocess
import time

def setup_model():
    """Train the ML model and save as PKL file"""
    print("🔧 Setting up ML model...")
    
    try:
        # Check if model already exists
        if os.path.exists("hydrogen_site_model.pkl"):
            print("✅ Model already exists: hydrogen_site_model.pkl")
            return True
        
        # Train new model
        print("Training new ML model...")
        from train_model import main as train_main
        train_main()
        
        if os.path.exists("hydrogen_site_model.pkl"):
            print("✅ Model trained successfully!")
            return True
        else:
            print("❌ Model training failed")
            return False
            
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        return False

def start_server():
    """Start the FastAPI server"""
    print("🚀 Starting FastAPI server...")
    
    try:
        # Start the server using uvicorn
        import uvicorn
        from app import app
        
        print("📍 Server starting on http://localhost:8000")
        print("📚 API Documentation: http://localhost:8000/docs")
        print("🔍 Health Check: http://localhost:8000/health")
        print("=" * 60)
        print("Press Ctrl+C to stop the server")
        print("=" * 60)
        
        uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
        
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Server failed to start: {e}")
        return False
    
    return True

def main():
    """Main setup and run function"""
    print("🎯 Hydrogen Site Recommender - Complete Setup & Run")
    print("=" * 60)
    
    # Step 1: Setup model
    if not setup_model():
        print("❌ Model setup failed. Exiting.")
        sys.exit(1)
    
    # Step 2: Start server
    if not start_server():
        print("❌ Server failed to start. Exiting.")
        sys.exit(1)

if __name__ == "__main__":
    main()
