require('dotenv').config();
const axios = require('axios');

async function testAuthAPI() {
    console.log('🔍 Testing Auth API Endpoints\n');
    
    const API_BASE = 'http://localhost:5000';
    
    // Set axios to not throw errors for HTTP error codes
    axios.defaults.validateStatus = function (status) {
        return status < 600; // Accept any response
    };
    
    try {
        // Test 1: Health check
        console.log('1️⃣ Testing Health Check...');
        const healthResponse = await axios.get(`${API_BASE}/`);
        console.log(`   Status: ${healthResponse.status}`);
        console.log(`   Response: ${healthResponse.data}`);
        
        // Test 2: Registration endpoint
        console.log('\n2️⃣ Testing Registration API...');
        const registerData = {
            name: 'Test User',
            email: 'test.api@example.com',
            password: 'test123',
            mobile: '9876543210',
            year: '3rd',
            department: 'Computer Engineering'
        };
        
        const registerResponse = await axios.post(`${API_BASE}/api/auth/register`, registerData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`   Status: ${registerResponse.status}`);
        console.log(`   Response:`, registerResponse.data);
        
        if (registerResponse.status === 201) {
            console.log('✅ Registration API Working!');
            
            // Test 3: Get OTP for debugging
            console.log('\n3️⃣ Getting OTP from debug endpoint...');
            try {
                const debugResponse = await axios.get(`${API_BASE}/api/auth/debug-otp/${registerData.email}`);
                console.log(`   Debug Status: ${debugResponse.status}`);
                console.log(`   OTP: ${debugResponse.data.otp}`);
                console.log(`   Expires: ${debugResponse.data.otpExpires}`);
            } catch (debugError) {
                console.log(`   Debug Error: ${debugError.response?.data?.message || debugError.message}`);
            }
        } else {
            console.log('❌ Registration API Error');
        }
        
        // Test 4: Login endpoint
        console.log('\n4️⃣ Testing Login API...');
        const loginData = {
            email: registerData.email,
            password: registerData.password
        };
        
        const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, loginData);
        console.log(`   Status: ${loginResponse.status}`);
        console.log(`   Response:`, loginResponse.data);
        
    } catch (error) {
        console.error('❌ API Test Error:');
        console.error('   Message:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
        if (error.code === 'ECONNREFUSED') {
            console.error('   🔥 Server is not running or not accessible on port 5000');
        }
    }
}

// Also test mailer configuration
async function testMailerConfig() {
    console.log('\n📧 Testing Mailer Configuration...');
    try {
        const transporter = require('./config/mailer');
        console.log('✅ Mailer module loaded successfully');
        
        // Check if transporter has verify method
        if (typeof transporter.verify === 'function') {
            try {
                const verified = await transporter.verify();
                console.log('✅ Email transporter verified:', verified);
            } catch (verifyError) {
                console.log('❌ Email verification failed:', verifyError.message);
            }
        } else {
            console.log('⚠️ Transporter does not have verify method (might be in dev mode)');
        }
        
    } catch (mailerError) {
        console.error('❌ Mailer configuration error:', mailerError.message);
    }
}

// Run tests
console.log('🚀 Starting API and Configuration Tests...\n');
testAuthAPI()
    .then(() => testMailerConfig())
    .then(() => {
        console.log('\n✅ API Tests Complete!');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Test execution failed:', error.message);
        process.exit(1);
    });
