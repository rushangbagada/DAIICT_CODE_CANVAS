# Hydrogen Site Recommender - FastAPI Server with PKL Model

This FastAPI server provides ML-powered recommendations for optimal hydrogen production sites based on geographic areas. The system uses a trained XGBoost model saved as a PKL file for efficient predictions.

## 🚀 Quick Start

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Installation & Setup

#### Option 1: Using the provided scripts (Recommended)

**Windows:**
```bash
# Double-click the start_server.bat file
# OR run from command prompt:
start_server.bat
```

**Unix/Linux/Mac:**
```bash
# Make script executable (first time only)
chmod +x start_server.sh

# Run the script
./start_server.sh
```

#### Option 2: Manual setup

```bash
# Navigate to the ml-model directory
cd ml-model

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Unix/Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train model and start server
python setup_and_run.py
```

## 🧠 ML Model Workflow

### 1. **Model Training** (`train_model.py`)
- Generates synthetic hydrogen site data covering India
- Trains XGBoost regressor with 5 key features
- Saves trained model as `hydrogen_site_model.pkl`
- Creates dataset files for API use

### 2. **Model Loading** (`app.py`)
- Automatically loads the trained PKL model on startup
- If no model exists, triggers training automatically
- Uses the loaded model for real-time predictions

### 3. **Real-time Predictions**
- Receives polygon coordinates from frontend
- Filters sites within the geographic area
- Uses trained model to predict site scores
- Returns ranked recommendations

## 🌐 Server Endpoints

Once the server is running, it will be available at `http://localhost:8000`

### Available Endpoints:

- **`GET /`** - Health check with model status
- **`GET /health`** - Detailed health status including model info
- **`GET /info`** - API information and model details
- **`POST /recommend_sites`** - Main ML recommendation endpoint
- **`GET /docs`** - Interactive API documentation (Swagger UI)

## 🔧 API Usage

### Main Recommendation Endpoint

**Endpoint:** `POST /recommend_sites`

**Request Body:**
```json
{
  "polygon_points": [
    [23.5937, 78.9629],
    [23.5937, 78.9729],
    [23.6037, 78.9729],
    [23.6037, 78.9629]
  ]
}
```

**Response:**
```json
{
  "message": "Candidate sites found in polygon.",
  "recommended_sites": [
    {
      "lat": 23.5937,
      "lon": 78.9629,
      "capacity": 120.5,
      "distance_to_renewable": 5.2,
      "demand_index": 85.3,
      "water_availability": 65.8,
      "land_cost": 45.2,
      "predicted_score": 0.87,
      "site_id": "site_0001"
    }
  ],
  "total_sites_found": 15,
  "polygon_analysis": {
    "area_km2": "12.45",
    "point_count": 4,
    "status": "sites_found"
  }
}
```

## 🔗 Frontend Integration

The FastAPI server is designed to work seamlessly with the MERN frontend. The frontend component `IndiaPolygonMap.jsx` already includes the necessary integration code.

### Frontend Configuration

The frontend is configured to call the FastAPI server at `http://localhost:8000`. No additional configuration is needed.

### How It Works

1. **User draws a polygon** on the map using the frontend interface
2. **Frontend sends polygon coordinates** to the FastAPI server
3. **PKL model processes the request** and filters sites within the polygon
4. **Server returns recommended sites** with ML-predicted scores
5. **Frontend displays results** as markers on the map

## 🧠 ML Model Details

### Features Used
- **Capacity**: Hydrogen production capacity (MW)
- **Distance to Renewable**: Proximity to renewable energy sources (km)
- **Demand Index**: Local demand for hydrogen (0-100)
- **Water Availability**: Water resource availability (%)
- **Land Cost**: Land acquisition cost (₹k)

### Model Architecture
- **Algorithm**: XGBoost Regressor
- **Preprocessing**: StandardScaler for feature normalization
- **Training**: Automatic training on synthetic dataset
- **Storage**: Saved as PKL file for fast loading

### Dataset
- **Source**: Synthetic dataset covering India (lat: 8.0-37.0, lon: 68.0-97.0)
- **Size**: 1000+ candidate sites
- **Generation**: Automatically created during training

## 🛠️ Development

### Project Structure
```
ml-model/
├── app.py                    # Main FastAPI application
├── train_model.py           # Model training script
├── setup_and_run.py         # Complete setup and run script
├── start_server.bat         # Windows batch file
├── start_server.sh          # Unix/Linux/Mac shell script
├── requirements.txt         # Python dependencies
├── README.md               # This file
├── test_pkl_model.py       # PKL model testing
├── test_api.py             # API testing
├── demo.py                 # Workflow demonstration
├── hydrogen_sites_generated.csv # Dataset (created after training)
└── venv/                   # Virtual environment (created automatically)
```

### Training New Models

To retrain the model with new data:

```bash
# Activate virtual environment
source venv/bin/activate  # Unix/Mac
# OR
venv\Scripts\activate     # Windows

# Train new model
python train_model.py

# Start server with new model
python setup_and_run.py
```

### Adding New Features

1. **Update Features**: Modify the `FEATURES` list in `train_model.py`
2. **Update Data Generation**: Modify the `generate_synthetic_dataset()` function
3. **Retrain Model**: Run `python train_model.py`
4. **Restart Server**: The new model will be automatically loaded

### Testing

Test the API using the interactive documentation:
1. Start the server
2. Open `http://localhost:8000/docs` in your browser
3. Use the Swagger UI to test endpoints

## 🚨 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Change port in setup_and_run.py
port = 8001  # or any available port
```

**Python not found:**
- Ensure Python is installed and in your system PATH
- Use `python3` instead of `python` on some systems

**Dependencies not found:**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Model training fails:**
```bash
# Check if all required packages are installed
pip install -r requirements.txt

# Try training manually
python train_model.py
```

**CORS errors:**
- The server includes CORS middleware for common frontend ports
- If using a different port, update the `allow_origins` list in `app.py`

### Logs

The server provides detailed logging. Check the console output for:
- Model training progress
- Model loading status
- Dataset generation status
- API request logs
- Error messages

## 📚 Additional Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **XGBoost Documentation**: https://xgboost.readthedocs.io/
- **Shapely Documentation**: https://shapely.readthedocs.io/
- **Joblib Documentation**: https://joblib.readthedocs.io/

## 🤝 Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the DAIICT Code Canvas initiative.
