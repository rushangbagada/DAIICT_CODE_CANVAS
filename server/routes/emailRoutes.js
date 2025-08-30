const express = require('express');
const multer = require('multer');
const transporter = require('../config/mailer');
const router = express.Router();

// Email template helper function
const createPDFEmailTemplate = (recipientName, message, stateName, totalPlants, totalCapacity, avgEfficiency) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Power Plants Report</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
            .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
            .content { padding: 30px; }
            .greeting { font-size: 18px; color: #2d5a27; margin-bottom: 20px; }
            .message { color: #495057; line-height: 1.6; margin-bottom: 25px; font-size: 16px; }
            .stats-container { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; }
            .stats-title { color: #2d5a27; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; }
            .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
            .stat-item { text-align: center; background: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .stat-value { font-size: 24px; font-weight: bold; color: #667eea; display: block; }
            .stat-label { font-size: 12px; color: #6c757d; text-transform: uppercase; margin-top: 5px; letter-spacing: 0.5px; }
            .attachment-info { background: linear-gradient(135deg, #e3f2fd 0%, #f0f9ff 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin: 25px 0; }
            .attachment-title { color: #1976d2; margin: 0 0 10px 0; font-size: 16px; font-weight: 600; }
            .attachment-details { color: #495057; margin: 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6; }
            .footer p { margin: 0; color: #6c757d; font-size: 14px; }
            .footer small { color: #adb5bd; font-size: 12px; margin-top: 10px; display: block; }
            .icon { margin-right: 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1><span class="icon">🌱</span>Green Hydrogen Initiative</h1>
                <p>Power Plants Database Report</p>
            </div>
            
            <div class="content">
                <div class="greeting">Hello ${recipientName}!</div>
                
                <div class="message">${message}</div>
                
                <div class="stats-container">
                    <h3 class="stats-title"><span class="icon">📊</span>Report Summary for ${stateName}</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-value">${totalPlants}</span>
                            <div class="stat-label">Total Plants</div>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${totalCapacity}</span>
                            <div class="stat-label">Total Capacity</div>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${avgEfficiency}</span>
                            <div class="stat-label">Avg Efficiency</div>
                        </div>
                    </div>
                </div>
                
                <div class="attachment-info">
                    <h4 class="attachment-title"><span class="icon">📎</span>Attachment Details</h4>
                    <p class="attachment-details">
                        <strong>File:</strong> ${stateName}_power_plants_report.pdf<br>
                        <strong>Format:</strong> Professional PDF Report<br>
                        <strong>Content:</strong> Detailed power plant information with capacity analysis, fuel types, operators, and efficiency ratings
                    </p>
                </div>
                
                <p style="color: #6c757d; font-size: 14px; line-height: 1.6;">
                    This comprehensive report contains detailed information about power plants in ${stateName}, 
                    including capacity analysis, fuel type distribution, operational statistics, and efficiency ratings. 
                    The data is compiled from our extensive power plants database.
                </p>
            </div>
            
            <div class="footer">
                <p>Generated on ${new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })} by Green Hydrogen Initiative</p>
                <small>Promoting sustainable energy solutions across India</small>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Configure multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // Reduced to 5MB for faster processing
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Helper function to send email with timeout
const sendEmailWithTimeout = async (mailOptions, timeoutMs = 30000) => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Email sending timeout after 30 seconds'));
    }, timeoutMs);

    transporter.sendMail(mailOptions)
      .then(info => {
        clearTimeout(timeout);
        resolve(info);
      })
      .catch(error => {
        clearTimeout(timeout);
        reject(error);
      });
  });
};

// Route to send PDF report via email
router.post('/send-pdf-report', upload.single('pdfFile'), async (req, res) => {
  const startTime = Date.now();
  
  try {
    const {
      recipientEmail,
      recipientName,
      message,
      stateName,
      totalPlants,
      totalCapacity,
      avgEfficiency
    } = req.body;

    // Validate required fields
    if (!recipientEmail) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email is required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Prepare email content using the template function
    const subject = `Power Plants Report - ${stateName}`;
    const htmlContent = createPDFEmailTemplate(
      recipientName || 'User',
      message || `Please find attached the comprehensive power plants report for ${stateName}.`,
      stateName,
      totalPlants,
      totalCapacity,
      avgEfficiency
    );

    // Plain text version for email clients that don't support HTML
    const textContent = `
Green Hydrogen Initiative - Power Plants Report

Hello ${recipientName || 'there'}!

${message || `Please find attached the comprehensive power plants report for ${stateName}.`}

Report Summary for ${stateName}:
- Total Plants: ${totalPlants}
- Total Capacity: ${totalCapacity}
- Average Efficiency: ${avgEfficiency}

Attachment: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB)

This report contains detailed information about power plants in ${stateName}, including capacity, fuel types, operators, and efficiency ratings.

Generated on ${new Date().toLocaleDateString()} by Green Hydrogen Initiative
Promoting sustainable energy solutions across India
    `;

    // Email options
    const mailOptions = {
      from: {
        name: 'Green Hydrogen Initiative',
        address: process.env.EMAIL_USER || 'noreply@greenhydrogen.org'
      },
      to: recipientEmail,
      subject: subject,
      text: textContent,
      html: htmlContent,
      attachments: [
        {
          filename: req.file.originalname,
          content: req.file.buffer,
          contentType: 'application/pdf'
        }
      ]
    };

    // Send email with timeout
    console.log(`📤 Sending email to ${recipientEmail}...`);
    const emailResult = await sendEmailWithTimeout(mailOptions, 30000);
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ Email sent successfully in ${processingTime}ms`);

    res.json({
      success: true,
      message: 'Email sent successfully',
      details: {
        recipient: recipientEmail,
        subject: subject,
        attachmentSize: `${(req.file.size / 1024).toFixed(1)} KB`,
        processingTime: `${processingTime}ms`,
        messageId: emailResult.messageId
      }
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum allowed size is 10MB.'
      });
    }

    if (error.message === 'Only PDF files are allowed') {
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check route for email service
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Email service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
