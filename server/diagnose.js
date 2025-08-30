console.log('🔍 QUICK DIAGNOSIS\n');

// Check if backend is accessible
async function checkBackend() {
    try {
        const response = await fetch('http://localhost:5000');
        const text = await response.text();
        console.log('✅ Backend (5000):', text);
    } catch (error) {
        console.log('❌ Backend (5000): NOT ACCESSIBLE');
    }
}

// Check if frontend is accessible  
async function checkFrontend() {
    try {
        const response = await fetch('http://localhost:5173');
        console.log('✅ Frontend (5173): ACCESSIBLE');
    } catch (error) {
        console.log('❌ Frontend (5173): NOT ACCESSIBLE - THIS IS THE PROBLEM!');
        console.log('🔥 SOLUTION: Start frontend with "npm run dev" in frontend folder');
    }
}

async function checkAPI() {
    console.log('\n🧪 Testing API endpoint...');
    const testData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123', 
        mobile: '1234567890',
        year: '3rd',
        department: 'Computer Engineering'
    };
    
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });
        const result = await response.json();
        console.log('✅ API Response:', result);
    } catch (error) {
        console.log('❌ API Error:', error.message);
    }
}

// Run all checks
console.log('Checking servers...\n');
checkBackend();
checkFrontend(); 
setTimeout(() => {
    checkAPI();
}, 100);
