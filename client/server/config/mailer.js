require('dotenv').config();
const nodemailer = require("nodemailer");

// Check if email credentials are configured
const hasEmailCredentials = process.env.EMAIL_USER && process.env.EMAIL_PASS;

// Choose your email service configuration
const emailConfig = {
  // Option 1: Brevo (Sendinblue) - Recommended
  brevo: {
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },
  
  // Option 2: Gmail
  gmail: {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use App Password, not regular password
    },
  },
  
  // Option 3: Outlook/Hotmail
  outlook: {
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  }
};

// Choose which email service to use (change this to switch services)
const emailService = process.env.EMAIL_SERVICE || 'brevo';

let transporter;

if (hasEmailCredentials) {
  const originalTransporter = nodemailer.createTransport(emailConfig[emailService]);
  
  // Create a wrapper to log OTPs
  transporter = {
    sendMail: async (options) => {
      // Extract OTP from email content
      const extractOTP = (htmlContent) => {
        // Look for 6-digit numbers in the email content
        const otpMatch = htmlContent.match(/>\s*(\d{6})\s*</g);
        if (otpMatch) {
          return otpMatch[0].replace(/[<>\s]/g, '');
        }
        return null;
      };
      
      // Log the email details with OTP
      const otp = extractOTP(options.html || '');
      if (otp) {
        console.log('\n🔔 ===== EMAIL SENDING =====');
        console.log('📧 To:', options.to);
        console.log('📝 Subject:', options.subject);
        console.log('🔢 OTP/TOKEN:', otp);
        console.log('⏰ Time:', new Date().toISOString());
        console.log('🔔 =========================\n');
      }
      
      // Send the actual email
      return await originalTransporter.sendMail(options);
    },
    
    verify: () => originalTransporter.verify()
  };
  
  // Test the connection
  originalTransporter.verify(function(error, success) {
    if (error) {
      console.log('❌ Email configuration error:', error.message);
    } else {
      console.log('✅ Email server is ready to send messages');
      console.log('🔔 OTP logging is ENABLED - OTPs will be displayed in terminal');
    }
  });
} else {
  console.log('🔧 DEVELOPMENT MODE: Email credentials not configured');
  console.log('📧 To enable email functionality, add EMAIL_USER and EMAIL_PASS to your .env file');
  console.log('📖 See EMAIL_SETUP.md for setup instructions');
  
  // Create a dummy transporter for development
  transporter = {
    sendMail: async (options) => {
      console.log('🔧 DEVELOPMENT MODE: Email would be sent to your_email@example.com');
      console.log('📧 OTP/Token:  (6-digit format)');
      console.log('📧 Subject:', options.subject);
      return Promise.resolve();
    }
  };
}

module.exports = transporter;
