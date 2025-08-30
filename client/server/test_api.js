// Using built-in fetch (Node.js 18+)

async function testMLAPI() {
  try {
    const testData = {
      coordinates: [
        { lat: 23.5937, lng: 78.9629 },
        { lat: 23.5937, lng: 78.9729 },
        { lat: 23.6037, lng: 78.9729 }
      ],
      polygonName: "Test Polygon",
      area: 0,
      pointCount: 3,
      mlInput: {}
    };

    console.log('Testing ML API endpoint...');
    console.log('Request data:', JSON.stringify(testData, null, 2));

    const response = await fetch('http://localhost:5000/api/ml/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }

    const result = await response.json();
    console.log('Success response:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testMLAPI();
