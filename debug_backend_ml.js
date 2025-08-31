// Debug script to test backend ML connection locally
const { default: fetch } = require('node-fetch');

const ML_BACKEND_URL = "https://daiict-code-canvas.onrender.com";

async function testMLConnection() {
  console.log('🔍 Testing Backend-to-ML Connection...');
  
  const testCoordinates = [
    { lat: 20.5, lng: 77.5 },
    { lat: 21.5, lng: 77.5 }, 
    { lat: 21.5, lng: 78.5 },
    { lat: 20.5, lng: 78.5 }
  ];

  // Convert coordinates to the format the ML service expects
  const formattedCoords = testCoordinates.map(coord => [coord.lat, coord.lng]);
  
  console.log('Formatted coordinates:', formattedCoords);
  
  try {
    const mlApiUrl = `${ML_BACKEND_URL}/recommend_sites`;
    console.log('Calling ML API at:', mlApiUrl);
    
    const response = await fetch(mlApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        polygon_points: formattedCoords
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`ML API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Success! ML Response:', {
      message: result.message,
      sitesCount: result.recommended_sites?.length || 0,
      totalFound: result.total_sites_found
    });
    
    return result;
  } catch (error) {
    console.error('❌ ML API call failed:', error.message);
    throw error;
  }
}

// Run the test
testMLConnection()
  .then(() => {
    console.log('✅ Backend-to-ML connection test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Backend-to-ML connection test failed:', error.message);
    process.exit(1);
  });
