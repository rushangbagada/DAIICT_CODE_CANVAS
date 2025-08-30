# ML Model Integration Guide

This guide explains how to integrate the coordinates from the IndianPolygonMap component with your existing ML models in the `ml-model` folder.

## 🎯 **Overview**

The system now automatically processes the 23 coordinate points and sends them to your existing hydrogen site recommendation ML models. When users submit a polygon, the coordinates are processed through your trained models to find optimal hydrogen production sites within the selected area.

## 🚀 **How It Works**

### 1. **Frontend Processing**
- User selects exactly 23 points on the map
- Coordinates are automatically formatted for ML input
- Data is sent to backend API endpoint (`/api/ml/predict`)
- ML results (hydrogen site recommendations) are displayed and stored

### 2. **Backend Integration**
- **Node.js Server**: Receives coordinates and calls Python ML models
- **Python Script**: `hydrogen_predict.py` interfaces with your existing models
- **ML Models**: Uses your trained models (`rf_model.pkl`, `xgb_model.pkl`, etc.)
- **Site Data**: Processes your hydrogen sites CSV files

### 3. **Data Flow**
```
Frontend → Node.js API → Python Script → ML Models → Hydrogen Sites → Results
```

## 🔧 **Integration Setup**

### **Step 1: Install Dependencies**

In your `ml-model` folder:
```bash
pip install -r requirements.txt
```

### **Step 2: Start Your Server**

The ML routes are already added to your `server.js`:
```javascript
const mlRoutes = require('./mlRoutes');
app.use('/api/ml', mlRoutes);
```

### **Step 3: Test the Integration**

1. Start your server: `npm start`
2. Use the frontend to create a polygon
3. Submit to see ML results

## 📊 **ML Model Input/Output**

### **Input Format**
Your ML models receive coordinates in this format:
```json
{
  "points": [[lat1, lng1], [lat2, lng2], ...], // 23 points
  "area": calculated_area,
  "pointCount": 23
}
```

### **Output Format**
The system returns:
```json
{
  "polygon_analysis": {
    "area": 1234.56,
    "center": {"lat": 22.9734, "lon": 78.6569},
    "bounding_box": {...},
    "point_count": 23
  },
  "recommended_sites": [
    {
      "lat": 22.9734,
      "lon": 78.6569,
      "capacity": 1000,
      "distance_to_renewable": 50,
      "demand_index": 0.8,
      "water_availability": 0.9,
      "land_cost": 100,
      "random_forest_score": 0.85,
      "xgboost_score": 0.82
    }
  ],
  "total_sites_found": 15,
  "predictions_available": ["random_forest_score", "xgboost_score"],
  "message": "Found 15 hydrogen sites in selected area"
}
```

## 🎨 **Your ML Models Used**

The system automatically loads and uses these models from your `ml-model` folder:

- **`rf_model.pkl`** - Random Forest model
- **`xgb_model.pkl`** - XGBoost model  
- **`site_model.pkl`** - Site recommendation model
- **`xgb_hydrogen_model.pkl`** - Hydrogen-specific XGBoost model
- **`final_hydrogen_model.pkl`** - Final hydrogen model

## 🔍 **Site Data Processing**

The system automatically loads and processes your hydrogen sites data:

- **`hydrogen_sites.csv`** - Main sites data
- **`hydrogen_sites_final_train.csv`** - Training data
- **`hydrogen_sites_extensive.csv`** - Extended dataset

## 🚀 **Features**

### **Automatic Processing**
- ✅ 23-point coordinate validation
- ✅ Polygon area calculation
- ✅ Site filtering by geographic area
- ✅ ML model prediction on filtered sites
- ✅ Score ranking and recommendations

### **ML Model Integration**
- ✅ Loads all available trained models
- ✅ Automatic feature preparation
- ✅ Fallback to weighted scoring if ML fails
- ✅ Multiple prediction types (RF, XGBoost, etc.)

### **Data Export**
- ✅ JSON format for API consumption
- ✅ CSV export for offline analysis
- ✅ NumPy arrays for Python processing
- ✅ TensorFlow tensors for deep learning

## 🎯 **Customization Options**

### **Modify Feature Extraction**
Edit `hydrogen_predict.py` to change how coordinates are processed:

```python
def extract_custom_features(coordinates):
    # Add your custom feature engineering
    custom_features = {
        'geographic_complexity': calculate_complexity(coordinates),
        'elevation_variance': get_elevation_variance(coordinates),
        'climate_zone': determine_climate_zone(coordinates)
    }
    return custom_features
```

### **Add New ML Models**
Simply place new `.pkl` files in your `ml-model` folder - they'll be automatically loaded:

```python
# Add to load_ml_models() function
model_files = {
    'random_forest': 'rf_model.pkl',
    'xgboost': 'xgb_model.pkl',
    'your_new_model': 'new_model.pkl'  # Add this
}
```

### **Custom Site Scoring**
Modify the scoring weights in `predict_site_scores()`:

```python
weights = {
    "capacity": 0.5,           # Increase capacity importance
    "distance_to_renewable": -0.4,  # Increase renewable proximity weight
    "demand_index": 0.4,       # Increase demand importance
    "water_availability": 0.3, # Increase water importance
    "land_cost": -0.2          # Increase land cost consideration
}
```

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Python Path Issues**
   ```bash
   # Ensure Python is in PATH
   which python
   python --version
   ```

2. **Missing Dependencies**
   ```bash
   # Install all requirements
   pip install -r requirements.txt
   ```

3. **Model File Not Found**
   - Check that `.pkl` files exist in `ml-model` folder
   - Verify file permissions

4. **Coordinate Format Issues**
   - Ensure coordinates are [lat, lng] format
   - Check for NaN or invalid values

### **Debug Mode**
Enable detailed logging by checking server console and Python stderr output.

## 📝 **API Endpoints**

### **POST /api/ml/predict**
- **Input**: Polygon coordinates (23 points)
- **Output**: Hydrogen site recommendations
- **Usage**: Called automatically when polygon is submitted

### **GET /api/ml/status**
- **Output**: ML model status and information
- **Usage**: Check if ML service is running

### **GET /api/ml/info**
- **Output**: Detailed model information
- **Usage**: Get model capabilities and requirements

## 🚀 **Quick Start**

1. **Ensure your ML models are ready** in `ml-model` folder
2. **Install Python dependencies**: `pip install -r requirements.txt`
3. **Start your Node.js server**: `npm start`
4. **Use the frontend** to create polygons and get ML predictions
5. **View results** in the ML Results section

## 📞 **Support**

- Check server console for API call details
- Verify Python script execution in `ml-model` folder
- Review coordinate format in browser console
- Test ML endpoint with Postman/curl

The system is now fully integrated with your existing ML models and will automatically process coordinates to provide hydrogen site recommendations based on your trained models!
