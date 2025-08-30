require('dotenv').config();
const axios = require('axios');

async function quickTest() {
    const uniqueId = Date.now();
    const testData = {
        name: `Test User ${uniqueId}`,
        email: `test${uniqueId}@example.com`,
        password: 'test123',
        mobile: `987654${uniqueId.toString().slice(-4)}`,
        year: '3rd',
        department: 'Computer Engineering'
    };
    
    console.log('🧪 Testing registration with unique data...');
    console.log('📧 Email:', testData.email);
    console.log('📱 Mobile:', testData.mobile);
    
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', testData);
        console.log('\n✅ REGISTRATION SUCCESS!');
        console.log('Status:', response.status);
        console.log('Response:', response.data);
        
        // Wait 2 seconds for potential OTP logging
        console.log('\n⏳ Waiting for OTP to be generated and logged...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return testData.email;
    } catch (error) {
        console.log('\n❌ REGISTRATION FAILED');
        console.log('Error:', error.response?.data?.message || error.message);
        return null;
    }
}

quickTest();
