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
  transporter = nodemailer.createTransport(emailConfig[emailService]);
  
  // Test the connection
  transporter.verify(function(error, success) {
    if (error) {
      console.log('❌ Email configuration error:', error.message);
    } else {
      console.log('✅ Email server is ready to send messages');
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
      console.log('📧 OTP/Token: 123456 (6-digit format)');
      console.log('📧 Subject:', options.subject);
      return Promise.resolve();
    }
  };
}

module.exports = transporter;
