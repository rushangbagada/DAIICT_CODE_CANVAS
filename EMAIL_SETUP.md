# Email Setup Guide for Campus Sports Hub Authentication

This guide will help you set up email functionality for user registration verification and password reset features.

## Email Service Setup (Brevo/Sendinblue)

### 1. Create a Brevo Account
1. Go to [Brevo (formerly Sendinblue)](https://www.brevo.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key
1. Log in to your Brevo dashboard
2. Go to **Settings** → **API Keys**
3. Create a new API key with **SMTP** permissions
4. Copy the API key (you'll need this for the environment variables)

### 3. Environment Variables Setup

Create a `.env` file in the `server` directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sports_hub

# JWT Secret (generate a secure random string)
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here

# Email Configuration (Brevo/Sendinblue)
EMAIL_USER=your_brevo_email@example.com
EMAIL_PASS=your_brevo_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. Alternative Email Services

If you prefer to use other email services, update the `config/mailer.js` file:

#### Gmail Setup
```javascript
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Use App Password, not regular password
  }
});
```

#### Outlook/Hotmail Setup
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

#### Custom SMTP Server
```javascript
const transporter = nodemailer.createTransporter({
  host: 'your-smtp-server.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## Features Included

### 1. Email Verification
- **Registration Flow**: Users receive a 6-digit OTP after registration
- **Email Template**: Professional HTML email with Campus Sports Hub branding
- **OTP Expiry**: 10-minute validity period
- **Resend Functionality**: Users can request new OTP if needed

### 2. Password Reset
- **Forgot Password**: Users can request password reset via email
- **Reset Token**: 8-character alphanumeric token sent via email
- **Secure Reset**: Token expires after 10 minutes
- **Professional Templates**: Branded email templates for password reset

### 3. Email Templates

The system includes beautiful HTML email templates for:
- **Welcome & Verification**: Blue-themed template with OTP display
- **Password Reset**: Red-themed template with reset token
- **Responsive Design**: Works on desktop and mobile email clients

## Testing Email Functionality

### 1. Local Testing
1. Start the server: `npm run dev`
2. Register a new user with a valid email
3. Check your email for the verification OTP
4. Test the forgot password functionality

### 2. Email Testing Tools
- **Mailtrap**: Use for development testing (emails won't be sent to real users)
- **Ethereal Email**: Another testing service for development

### 3. Production Considerations
- **Email Deliverability**: Use a reputable email service provider
- **SPF/DKIM**: Configure DNS records for better deliverability
- **Rate Limiting**: Implement rate limiting for email sending
- **Monitoring**: Set up email delivery monitoring

## Security Best Practices

### 1. Environment Variables
- Never commit `.env` files to version control
- Use strong, unique JWT secrets
- Rotate API keys regularly

### 2. Email Security
- Use HTTPS for all email communications
- Implement rate limiting for email requests
- Validate email addresses before sending
- Log email sending activities for monitoring

### 3. OTP Security
- Use cryptographically secure random number generation
- Implement proper OTP expiry
- Limit OTP resend attempts
- Clear OTP data after successful verification

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check API key permissions
   - Verify email credentials
   - Check SMTP settings

2. **Emails going to spam**
   - Configure SPF/DKIM records
   - Use a reputable email service
   - Avoid spam trigger words

3. **OTP not working**
   - Check server time synchronization
   - Verify OTP generation logic
   - Check database connection

### Debug Mode

Enable debug logging by adding to your `.env`:
```env
DEBUG_EMAIL=true
```

This will log email sending attempts to the console.

## Support

If you encounter issues with email setup:
1. Check the Brevo documentation
2. Verify your environment variables
3. Test with a simple email first
4. Check server logs for error messages

## Next Steps

After setting up email functionality:
1. Test the complete registration flow
2. Test password reset functionality
3. Customize email templates if needed
4. Set up email monitoring for production
5. Configure backup email service if needed 