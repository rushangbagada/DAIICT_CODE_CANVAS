#!/usr/bin/env python3
"""
Startup script for the Enhanced Hydrogen Site Recommender Backend
"""

import os
import sys
import time
import logging

# Add current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

def setup_logging():
    """Setup logging configuration"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    return logging.getLogger(__name__)

def check_dependencies():
    """Check if all required dependencies are available"""
    logger = logging.getLogger(__name__)
    
    required_packages = [
        'fastapi', 'uvicorn', 'pandas', 'numpy', 
        'shapely', 'joblib', 'scikit-learn', 'xgboost'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        logger.error(f"Missing required packages: {missing_packages}")
        logger.error("Please install them using: pip install -r requirements.txt")
        return False
    
    logger.info("✅ All dependencies are available")
    return True

def setup_model():
    """Setup ML model if needed"""
    logger = logging.getLogger(__name__)
    
    try:
        # Check if model already exists
        if os.path.exists("hydrogen_site_model.pkl"):
            logger.info("✅ Model already exists: hydrogen_site_model.pkl")
            return True
        
        # Train new model
        logger.info("Training new ML model...")
        from train_model import main as train_main
        train_main()
        
        if os.path.exists("hydrogen_site_model.pkl"):
            logger.info("✅ Model trained successfully!")
            return True
        else:
            logger.error("❌ Model training failed")
            return False
            
    except Exception as e:
        logger.error(f"❌ Setup failed: {e}")
        return False

def start_backend():
    """Start the enhanced FastAPI backend"""
    logger = logging.getLogger(__name__)
    
    try:
        import uvicorn
        from backend.app import app
        
        logger.info("🚀 Starting Enhanced Hydrogen Site Recommender Backend...")
        logger.info(f"📍 Server will be available at: http://localhost:8000")
        logger.info(f"📚 API Documentation: http://localhost:8000/docs")
        logger.info(f"🔍 Health Check: http://localhost:8000/health")
        logger.info(f"📊 API Info: http://localhost:8000/info")
        logger.info("=" * 60)
        logger.info("Enhanced Features:")
        logger.info("• Structured API with versioning (/api/v1/)")
        logger.info("• Comprehensive request/response validation")
        logger.info("• Advanced error handling and logging")
        logger.info("• Model management endpoints")
        logger.info("• Dataset status monitoring")
        logger.info("• Performance metrics")
        logger.info("=" * 60)
        logger.info("Press Ctrl+C to stop the server")
        logger.info("=" * 60)
        
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8000,
            log_level="info",
            reload=True
        )
        
    except KeyboardInterrupt:
        logger.info("\n🛑 Server stopped by user")
    except Exception as e:
        logger.error(f"❌ Server failed to start: {e}")
        return False
    
    return True

def main():
    """Main startup function"""
    logger = setup_logging()
    
    logger.info("🎯 Enhanced Hydrogen Site Recommender Backend - Startup")
    logger.info("=" * 60)
    
    # Step 1: Check dependencies
    if not check_dependencies():
        logger.error("❌ Dependency check failed. Exiting.")
        sys.exit(1)
    
    # Step 2: Setup model
    if not setup_model():
        logger.error("❌ Model setup failed. Exiting.")
        sys.exit(1)
    
    # Step 3: Start backend
    if not start_backend():
        logger.error("❌ Backend failed to start. Exiting.")
        sys.exit(1)

if __name__ == "__main__":
    main()
