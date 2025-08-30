require('dotenv').config();
const nodemailer = require('nodemailer');

async function testGmailConnection() {
    console.log('🔍 Gmail Connection Diagnostic\n');
    
    // Check environment variables
    console.log('📋 Configuration Check:');
    console.log(`✅ EMAIL_USER: ${process.env.EMAIL_USER}`);
    console.log(`✅ EMAIL_SERVICE: ${process.env.EMAIL_SERVICE}`);
    console.log(`✅ EMAIL_PASS: ${process.env.EMAIL_PASS ? '*'.repeat(process.env.EMAIL_PASS.length) : 'NOT SET'}`);
    console.log(`✅ Pass Length: ${process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0} characters`);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('❌ Missing email credentials in .env file');
        return;
    }
    
    // Create transporter with detailed config
    console.log('\n🔧 Creating Gmail Transporter...');
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        debug: true, // Enable debug mode
        logger: true // Enable logging
    });
    
    try {
        console.log('\n🧪 Testing Gmail Connection...');
        
        // Test connection
        const isConnected = await transporter.verify();
        
        if (isConnected) {
            console.log('✅ Gmail connection successful!');
            
            // Try to send a test email
            console.log('\n📧 Sending test email...');
            
            const testEmailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER, // Send to yourself
                subject: 'Test Email - Campus Sports Hub',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                        <div style="background-color: white; padding: 20px; border-radius: 10px;">
                            <h2 style="color: #333;">🎯 Gmail Configuration Test</h2>
                            <p>If you receive this email, your Gmail configuration is working correctly!</p>
                            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
                            <p><strong>From:</strong> Campus Sports Hub Server</p>
                        </div>
                    </div>
                `
            };
            
            const info = await transporter.sendMail(testEmailOptions);
            
            console.log('✅ Test email sent successfully!');
            console.log(`📬 Message ID: ${info.messageId}`);
            console.log(`📊 Response: ${info.response}`);
            console.log(`📧 Check your email: ${process.env.EMAIL_USER}`);
            
        } else {
            console.log('❌ Gmail connection failed');
        }
        
    } catch (error) {
        console.log('❌ Gmail connection error:');
        console.log(`   Error Code: ${error.code || 'Unknown'}`);
        console.log(`   Error Message: ${error.message}`);
        
        // Provide specific troubleshooting
        if (error.code === 'EAUTH') {
            console.log('\n🔧 AUTHENTICATION ERROR TROUBLESHOOTING:');
            console.log('1. ❌ Your Gmail App Password might be incorrect');
            console.log('2. ❌ 2-Factor Authentication might not be enabled');
            console.log('3. ❌ App Password might be expired or revoked');
            console.log('\n📝 Steps to fix:');
            console.log('   → Enable 2-Factor Authentication on your Google account');
            console.log('   → Generate a NEW App Password specifically for this app');
            console.log('   → Update your .env file with the new App Password');
        } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
            console.log('\n🔧 NETWORK ERROR TROUBLESHOOTING:');
            console.log('1. ❌ Internet connection issue');
            console.log('2. ❌ Firewall blocking Gmail SMTP');
            console.log('3. ❌ DNS resolution problem');
        } else if (error.code === 'ETIMEDOUT') {
            console.log('\n🔧 TIMEOUT ERROR TROUBLESHOOTING:');
            console.log('1. ❌ Network connection slow or unstable');
            console.log('2. ❌ Gmail servers might be experiencing issues');
        }
    }
}

// Additional function to show how to update Gmail settings
function showGmailSetupInstructions() {
    console.log('\n📚 GMAIL SETUP INSTRUCTIONS');
    console.log('=' * 60);
    
    console.log('\n1️⃣ ENABLE 2-FACTOR AUTHENTICATION:');
    console.log('   🔗 Go to: https://myaccount.google.com/security');
    console.log('   ✅ Turn ON "2-Step Verification"');
    
    console.log('\n2️⃣ GENERATE APP PASSWORD:');
    console.log('   🔗 Go to: https://myaccount.google.com/apppasswords');
    console.log('   ✅ Select "Mail" as the app');
    console.log('   ✅ Select "Other" as device and enter "Campus Sports Hub"');
    console.log('   ✅ Copy the 16-character password (no spaces)');
    
    console.log('\n3️⃣ UPDATE YOUR .env FILE:');
    console.log('   📝 Open: server/.env');
    console.log('   ✏️  Update: EMAIL_USER="your_gmail@gmail.com"');
    console.log('   ✏️  Update: EMAIL_PASS="your_16_char_app_password"');
    console.log('   ✏️  Ensure: EMAIL_SERVICE=gmail');
    
    console.log('\n4️⃣ RESTART SERVER:');
    console.log('   🔄 Stop current server (Ctrl+C)');
    console.log('   🚀 Run: npm run dev');
    
    console.log('\n⚠️  COMMON MISTAKES:');
    console.log('   ❌ Using regular Gmail password instead of App Password');
    console.log('   ❌ Including spaces in App Password');
    console.log('   ❌ Not enabling 2-Factor Authentication first');
    console.log('   ❌ Using old or revoked App Password');
}

// Run the test
testGmailConnection().then(() => {
    showGmailSetupInstructions();
    console.log('\n✨ Gmail diagnostic complete!');
}).catch(console.error);
