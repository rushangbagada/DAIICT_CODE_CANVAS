# MERN + FastAPI ML Integration Guide

This guide explains how to integrate the FastAPI ML server with your MERN (MongoDB, Express.js, React, Node.js) stack for hydrogen site recommendations.

## 🏗️ Architecture Overview

```
┌─────────────────┐    HTTP Requests    ┌──────────────────┐
│   React Frontend │ ◄─────────────────► │   FastAPI ML     │
│                 │                     │   Server         │
│ - Map Interface │                     │ - ML Models      │
│ - Polygon Draw  │                     │ - Site Filtering │
│ - Results Display│                     │ - Predictions    │
└─────────────────┘                     └──────────────────┘
         │                                        │
         │                                        │
         ▼                                        ▼
┌─────────────────┐                     ┌──────────────────┐
│  Express Server │                     │   ML Dataset     │
│                 │                     │                  │
│ - Auth Routes   │                     │ - Site Data      │
│ - ML Routes     │                     │ - Models         │
│ - Database      │                     │ - Generated Data │
└─────────────────┘                     └──────────────────┘
```

## 🚀 Quick Start

### 1. Start the FastAPI ML Server

```bash
# Navigate to ml-model directory
cd ml-model

# Windows
start_server.bat

# Unix/Linux/Mac
./start_server.sh

# Manual
python start_server.py
```

The server will start on `http://localhost:8000`

### 2. Start the MERN Backend

```bash
# Navigate to server directory
cd DAIICT_CODE_CANVAS/server

# Install dependencies (if not already done)
npm install

# Start the server
npm start
```

The Express server will start on `http://localhost:5000`

### 3. Start the React Frontend

```bash
# Navigate to frontend directory
cd DAIICT_CODE_CANVAS/frontend

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The React app will start on `http://localhost:5173` (or similar)

## 🔗 Integration Points

### Frontend → FastAPI (Direct Integration)

The `IndiaPolygonMap.jsx` component directly calls the FastAPI server:

```javascript
// Function to call ML API endpoint
const callMLAPI = async (inputData) => {
  try {
    // Call FastAPI server directly on port 8000
    const response = await fetch('http://localhost:8000/recommend_sites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        polygon_points: inputData.polygon_points
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || errorData.message || `HTTP ${response.status}`;
      throw new Error(`ML API error: ${response.status} - ${errorMessage}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('ML API call failed:', error);
    throw new Error(`ML processing failed: ${error.message}`);
  }
};
```

### Data Flow

1. **User Interaction**: User draws a polygon on the map
2. **Coordinate Collection**: Frontend collects polygon coordinates
3. **API Request**: Frontend sends POST request to FastAPI server
4. **ML Processing**: FastAPI server processes coordinates with ML model
5. **Response**: Server returns recommended sites with scores
6. **Display**: Frontend displays results as map markers

## 🧠 ML Model Integration

### Features Used

The ML model considers these features for site recommendations:

- **Capacity**: Hydrogen production capacity (MW)
- **Distance to Renewable**: Proximity to renewable energy sources (km)
- **Demand Index**: Local demand for hydrogen (0-100)
- **Water Availability**: Water resource availability (%)
- **Land Cost**: Land acquisition cost (₹k)

### Model Output

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

## 🔧 Configuration

### CORS Settings

The FastAPI server includes CORS middleware configured for common frontend ports:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",    # React default
        "http://localhost:5173",    # Vite default
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Port Configuration

- **FastAPI ML Server**: Port 8000
- **Express Backend**: Port 5000
- **React Frontend**: Port 5173 (Vite) or 3000 (Create React App)

## 📊 API Endpoints

### FastAPI ML Server

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/health` | GET | Detailed health status |
| `/info` | GET | API information |
| `/recommend_sites` | POST | Main ML recommendation endpoint |
| `/docs` | GET | Interactive API documentation |

### Express Backend

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/*` | Various | Authentication routes |
| `/api/ml/*` | Various | ML-related routes (legacy) |
| `/api/ml/status` | GET | ML service status |

## 🧪 Testing

### Test the FastAPI Server

```bash
# Navigate to ml-model directory
cd ml-model

# Run the test script
python test_api.py
```

### Test the Frontend Integration

1. Start all servers
2. Open the React app
3. Navigate to the India Polygon Map component
4. Draw a polygon on the map
5. Click "Run ML Analysis"
6. Verify results are displayed

## 🚨 Troubleshooting

### Common Issues

#### FastAPI Server Won't Start

```bash
# Check if port 8000 is available
netstat -an | findstr :8000  # Windows
lsof -i :8000                # Unix/Linux/Mac

# Check Python installation
python --version
pip --version

# Check dependencies
pip install -r requirements.txt
```

#### CORS Errors

```bash
# Check browser console for CORS errors
# Ensure FastAPI server is running on correct port
# Verify CORS configuration in app.py
```

#### Frontend Can't Connect

```bash
# Check if FastAPI server is running
curl http://localhost:8000/health

# Check network tab in browser dev tools
# Verify URL in callMLAPI function
```

### Debug Mode

Enable debug logging in the FastAPI server:

```python
# In app.py, change log level
uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
```

## 🔄 Development Workflow

### 1. ML Model Updates

1. Modify `app.py` with new ML logic
2. Update `requirements.txt` if needed
3. Restart FastAPI server
4. Test with `test_api.py`

### 2. Frontend Updates

1. Modify React components
2. Update API calls if needed
3. Test polygon drawing and ML integration
4. Verify results display correctly

### 3. Backend Updates

1. Modify Express routes
2. Update database models if needed
3. Test API endpoints
4. Verify frontend integration

## 📈 Performance Considerations

### ML Model Optimization

- **Model Caching**: Pre-trained models are cached
- **Batch Processing**: Multiple sites processed together
- **Async Processing**: Non-blocking API responses

### Frontend Optimization

- **Debounced API Calls**: Prevent excessive requests
- **Result Caching**: Store previous results locally
- **Lazy Loading**: Load map components on demand

## 🔮 Future Enhancements

### Potential Improvements

1. **Real-time Updates**: WebSocket integration for live data
2. **Advanced ML Models**: Multiple model types and ensemble methods
3. **Data Persistence**: Store user polygons and results
4. **Export Functionality**: Download results as CSV/PDF
5. **Mobile Optimization**: Responsive design for mobile devices

### Integration Opportunities

1. **Database Storage**: Store ML results in MongoDB
2. **User Authentication**: Link ML analysis to user accounts
3. **Historical Analysis**: Track changes over time
4. **Collaborative Features**: Share polygons and results

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Leaflet Documentation](https://react-leaflet.js.org/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🤝 Support

For issues or questions:

1. Check the troubleshooting section
2. Review server logs
3. Test individual components
4. Check browser console for errors
5. Verify all services are running

---

**Happy Coding! 🚀**
