const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

// ML Backend Configuration
// Set ML_BACKEND_URL environment variable in Render dashboard
const ML_BACKEND_URL = process.env.ML_BACKEND_URL || 'https://daiict-code-canvas.onrender.com';
console.log('ML Backend URL configured:', ML_BACKEND_URL);

// Test endpoint for debugging
router.get('/test', (req, res) => {
  try {
    const mlModelPath = path.join(__dirname, '..', '..', 'ml-model');
    const pythonScript = path.join(mlModelPath, 'hydrogen_predict.py');
    
    res.json({
      status: 'test',
      paths: {
        mlModelPath,
        pythonScript,
        mlModelExists: fs.existsSync(mlModelPath),
        pythonScriptExists: fs.existsSync(pythonScript),
        currentDir: __dirname
      },
      pythonCheck: 'Will check Python availability...'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Test failed',
      message: error.message,
      stack: error.stack
    });
  }
});

// ML Model Integration Routes for Hydrogen Site Recommendation
router.post('/predict', async (req, res) => {
  try {
    const { coordinates, polygonName, area, pointCount, mlInput } = req.body;

    // Validate input
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 3) {
      return res.status(400).json({
        error: 'Invalid coordinates. At least 3 points are required to form a polygon.',
        received: coordinates ? coordinates.length : 0,
        minimum: 3,
        timestamp: new Date().toISOString()
      });
    }

    // Validate coordinate format
    const invalidCoords = coordinates.filter(coord => 
      !coord || 
      typeof coord.lat !== 'number' || 
      typeof coord.lng !== 'number' ||
      isNaN(coord.lat) || 
      isNaN(coord.lng) ||
      coord.lat < -90 || coord.lat > 90 ||
      coord.lng < -180 || coord.lng > 180
    );

    if (invalidCoords.length > 0) {
      return res.status(400).json({
        error: 'Invalid coordinate format detected.',
        invalidCount: invalidCoords.length,
        sample: invalidCoords[0],
        timestamp: new Date().toISOString()
      });
    }

    // Log the received data
    console.log('ML Model Input:', {
      polygonName,
      pointCount,
      area,
      coordinatesCount: coordinates.length,
      sampleCoordinates: coordinates.slice(0, 3)
    });

    // Call the ML model from ml-model folder
    const mlResult = await callHydrogenMLModel(coordinates);
    
    // Check if ML processing returned an error
    if (mlResult && mlResult.error) {
      return res.status(500).json({
        error: 'ML model processing error',
        message: mlResult.error,
        timestamp: new Date().toISOString()
      });
    }

    // Map status to user-friendly label
    const statusMap = {
      sites_found: 'Sites Found',
      no_sites_found: 'No Sites Found',
      error: 'Error',
    };
    const userStatus = statusMap[mlResult?.polygon_analysis?.status] || mlResult?.polygon_analysis?.status || '';

    // Improved message
    const userMessage = `Successfully analyzed your selected area with ${pointCount} points. Recommendations are ready!`;


    // Format site_id and generate a comment for each recommended site
    let recommendedSites = (mlResult.recommended_sites || []).map((site, idx) => {
      let newId = site.site_id;
      // If site_id is missing or not in 'site_XXXX' format, generate it
      if (!newId || !/^site_\d{4}$/.test(newId)) {
        newId = `site_${(idx + 1).toString().padStart(4, '0')}`;
      }
      // Generate a comment based on predicted_score
      let comment = '';
      const score = site.predicted_score;
      if (score >= 0.85) {
        comment = '🌟 Excellent site: Highly recommended for hydrogen production.';
      } else if (score >= 0.7) {
        comment = '✅ Good site: Strong potential for hydrogen production.';
      } else if (score >= 0.5) {
        comment = '⚠️ Fair site: Consider with caution, may need further review.';
      } else {
        comment = '❌ Poor site: Not recommended based on current analysis.';
      }
      return { ...site, site_id: newId, score_comment: comment };
    });

    // Clone mlResult and override status/message/sites for frontend
    const resultForFrontend = {
      ...mlResult,
      recommended_sites: recommendedSites,
      polygon_analysis: {
        ...mlResult.polygon_analysis,
        status: userStatus,
      },
    };

    res.json({
      success: true,
      ...resultForFrontend,
      inputShape: coordinates.length,
      message: userMessage,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('ML Processing Error:', error);
    
    // Handle different types of errors
    let errorMessage = 'ML processing failed';
    let statusCode = 500;

    if (error.message.includes('Python process exited')) {
      errorMessage = 'ML model execution failed. Please check Python environment and dependencies.';
      statusCode = 500;
    } else if (error.message.includes('Failed to start Python process')) {
      errorMessage = 'ML service unavailable. Python environment not accessible.';
      statusCode = 503;
    } else if (error.message.includes('Failed to parse ML result')) {
      errorMessage = 'ML model returned invalid data format.';
      statusCode = 500;
    } else if (error.message.includes('ENOENT')) {
      errorMessage = 'ML model files not found. Please check ml-model folder configuration.';
      statusCode = 404;
    } else if (error.message.includes('timeout')) {
      errorMessage = 'ML model processing timed out.';
      statusCode = 408;
    } else {
      errorMessage = error.message;
    }

    res.status(statusCode).json({
      error: 'ML processing failed',
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// Function to call the hydrogen ML model via HTTP API
async function callHydrogenMLModel(coordinates) {
  try {
    // Convert coordinates to the format the ML service expects
    // ML service expects [[lat, lon], [lat, lon], ...] format
    const formattedCoords = coordinates.map(coord => [coord.lat, coord.lng]);
    
    // Call the ML service using configured backend URL
    const mlApiUrl = `${ML_BACKEND_URL}/recommend_sites`;
    console.log('Calling ML API at:', mlApiUrl);
    console.log('Sending coordinates:', formattedCoords.length, 'points');
    
    const response = await axios.post(mlApiUrl, {
      polygon_points: formattedCoords
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000 // 30 second timeout
    });

    console.log('ML API Response Status:', response.status);
    console.log('ML API Response Headers:', response.headers);

    const result = response.data;
    console.log('ML API Success Response:', {
      message: result.message,
      sitesCount: result.recommended_sites?.length || 0,
      totalFound: result.total_sites_found
    });
    
    // Validate ML result structure
    if (!result || typeof result !== 'object') {
      throw new Error('ML model returned invalid result structure');
    }

    return result;
  } catch (error) {
    console.error('ML API call failed:', error);
    
    // Enhanced error details for axios
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data?.detail || error.response.data?.message || `HTTP ${error.response.status}`;
      throw new Error(`ML API error: ${error.response.status} - ${errorMessage}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error(`ML service connection failed: ${ML_BACKEND_URL} is not accessible`);
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`ML processing failed: ${error.message}`);
    }
  }
}

// Calculate polygon area using shoelace formula
function calculatePolygonArea(coordinates) {
  let area = 0;
  const n = coordinates.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += coordinates[i][0] * coordinates[j][1];
    area -= coordinates[j][0] * coordinates[i][1];
  }
  
  return Math.abs(area) / 2;
}

// Get ML model status
router.get('/status', (req, res) => {
  try {
    const mlModelPath = path.join(__dirname, '..', '..', 'ml-model');
    const pythonScript = path.join(mlModelPath, 'hydrogen_predict.py');
    
    const status = {
      status: 'active',
      model: 'hydrogen-site-recommender',
      lastUpdated: new Date().toISOString(),
      endpoints: ['/predict', '/status', '/info'],
      description: 'ML model for hydrogen site recommendation based on geographic polygons',
      inputRequirements: {
        points: 'At least 3 coordinate pairs (unlimited)',
        format: 'Array of [lat, lng] coordinates',
        coordinateSystem: 'WGS84 (decimal degrees)'
      },
      system: {
        mlModelPath: `Using HTTP API (${ML_BACKEND_URL})`,
        pythonScript: 'Not Required (HTTP API)',
        pythonAvailable: 'Not Required (HTTP API)'
      }
    };

    // Check if Python is available
    const pythonCheck = spawn('python', ['--version']);
    pythonCheck.on('close', (code) => {
      status.system.pythonAvailable = code === 0;
      res.json(status);
    });
    
    pythonCheck.on('error', () => {
      status.system.pythonAvailable = false;
      res.json(status);
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to check ML model status',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get ML model info
router.get('/info', (req, res) => {
  res.json({
    name: 'Hydrogen Site Recommender ML Model',
    version: '1.0.0',
    description: 'ML model for recommending optimal hydrogen production sites based on geographic areas',
    features: [
      'Site filtering by geographic polygon',
      'ML-based site scoring and ranking',
      'Hydrogen production capacity optimization',
      'Renewable energy proximity analysis',
      'Demand and infrastructure assessment',
      'Flexible polygon input (3+ points)'
    ],
    outputFormat: {
      recommendedSites: 'Array of top recommended sites',
      scores: 'ML prediction scores for each site',
      metadata: 'Analysis information and statistics'
    },
    requirements: {
      python: '3.7+',
      dependencies: ['pandas', 'numpy', 'scikit-learn', 'shapely', 'joblib'],
      models: ['rf_model.pkl', 'xgb_model.pkl', 'site_model.pkl', 'xgb_hydrogen_model.pkl']
    }
  });
});

// Health check for ML service
router.get('/health', async (req, res) => {
  try {
    // Test connection to ML backend
    const mlHealthUrl = `${ML_BACKEND_URL}/health`;
    
    const response = await axios.get(mlHealthUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000 // 10 second timeout
    });

    const mlHealth = response.data;
    res.json({
      status: 'healthy',
      service: 'ML Model Service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      ml_backend: {
        url: ML_BACKEND_URL,
        status: 'connected',
        response: mlHealth
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'ML Model Service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      ml_backend: {
        url: ML_BACKEND_URL,
        status: 'error',
        error: error.message
      }
    });
  }
});

module.exports = router;
