# 🔧 How to Update Gmail Configuration

## Current Status: ✅ WORKING
Your Gmail configuration is successfully sending emails. If you're not receiving them, check spam folder first.

## If You Need to Update Gmail App Password:

### 1️⃣ Generate New Gmail App Password

1. **Enable 2-Factor Authentication** (if not already done):
   - 🔗 Go to: https://myaccount.google.com/security
   - ✅ Turn ON "2-Step Verification"

2. **Create App Password**:
   - 🔗 Go to: https://myaccount.google.com/apppasswords
   - ✅ Select "Mail" as app
   - ✅ Select "Other" as device → Enter "Campus Sports Hub"
   - ✅ Copy the 16-character password (example: `abcd efgh ijkl mnop`)
   - ⚠️ Remove all spaces when copying!

### 2️⃣ Update .env File

Edit `server/.env` file and update these lines:

```env
EMAIL_USER="your_gmail@gmail.com"
EMAIL_PASS="your_new_16_char_app_password"
EMAIL_SERVICE=gmail
```

### 3️⃣ Restart Server

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### 4️⃣ Test Configuration

Run this command to test:

```bash
node -e "require('dotenv').config(); const transporter = require('./config/mailer'); transporter.verify().then(() => console.log('✅ Gmail working!')).catch(err => console.log('❌ Error:', err.message));"
```

## 🚨 Common Issues & Solutions

### Issue: "Not receiving emails"
- ✅ Check spam/junk folder
- ✅ Check Gmail tabs (Primary, Promotions, etc.)
- ✅ Check email filters
- ✅ Try a different email address for testing

### Issue: "Authentication failed"
- ❌ Using regular password instead of App Password
- ❌ App Password expired or revoked
- ❌ 2-Factor Authentication not enabled
- ❌ Spaces in App Password

### Issue: "Connection timeout"
- ❌ Firewall blocking port 587/465
- ❌ Network connectivity issues
- ❌ ISP blocking SMTP

## 📧 Alternative Email Services

If Gmail continues to have issues, you can switch to:

### Option 1: Brevo (Recommended)
```env
EMAIL_SERVICE=brevo
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_brevo_api_key
```

### Option 2: Outlook
```env
EMAIL_SERVICE=outlook  
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_app_password
```

## 🧪 Test Your Configuration

Your current Gmail setup shows:
- ✅ Authentication: SUCCESS
- ✅ Connection: SUCCESS  
- ✅ Email sending: SUCCESS
- ✅ Message ID: Generated successfully
- ✅ Gmail response: 250 OK

If emails aren't arriving, the issue is likely:
1. **Email filtering** on recipient side
2. **Delivery delays** (Gmail can take 1-5 minutes)
3. **Spam folder** placement

## 📞 Need Help?

1. Check the test email that was just sent to: rushi190807@gmail.com
2. Look in all email folders (Primary, Spam, Promotions)
3. Try sending OTP to a different email address
4. Check if your app has any email filtering rules
