# 🚀 Complete Auth System Setup Guide

## Current Status: ✅ Backend Working, Frontend Needs Setup

### **🔍 Issues Identified:**
1. ✅ Backend server running on port 5000 ✅ 
2. ✅ Gmail configuration working ✅
3. ✅ OTP logging enabled ✅
4. ❌ Frontend dev server not running (port 5173)
5. ❌ Frontend trying to connect to wrong port

---

## 📋 **Step-by-Step Solution**

### **1️⃣ Start Frontend Development Server**

Open a **NEW** terminal/PowerShell window and run:

```bash
# Navigate to frontend directory
cd C:\Users\Nihar\Documents\GitHub\DAIICT_CODE_CANVAS\frontend

# Install dependencies (if not already done)
npm install

# Start the frontend dev server
npm run dev
```

This will start Vite on port 5173. You should see output like:
```
Local:   http://localhost:5173/
```

### **2️⃣ Keep Backend Running**

In your current terminal, make sure backend is still running:
```bash
# If not running, start it:
cd C:\Users\Nihar\Documents\GitHub\DAIICT_CODE_CANVAS\server
npm run dev
```

You should see:
```
✅ Email server is ready to send messages
🔔 OTP logging is ENABLED - OTPs will be displayed in terminal
🚀 Green Hydrogen Platform Server running on port 5000
```

### **3️⃣ Test the Complete Flow**

1. **Open your browser**: http://localhost:5173
2. **Navigate to registration page**
3. **Fill registration form** with unique data:
   - Name: Test User
   - Email: test@example.com (use a unique email)
   - Password: test123
   - Mobile: 9876543210 (use unique number)
   - Select Year and Department

4. **Submit form** - You should see:
   - Frontend shows success message
   - Backend terminal shows: 🔔 REGISTRATION OTP with the 6-digit code
   - Email sent (if Gmail configured)

5. **Use the OTP** from terminal to verify login

---

## 🔧 **Current Configuration Status**

### **✅ Backend Configuration (Working)**
```env
# server/.env
EMAIL_USER=rushi190807@gmail.com
EMAIL_PASS=cyxetcrlfxbgbgkh (16 chars - App Password ✅)
EMAIL_SERVICE=gmail
MONGO_URI=mongodb+srv://... (Connected ✅)
PORT=5000
```

### **✅ Frontend Configuration (Working)**
```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',  // ✅ Correct backend URL
      changeOrigin: true
    }
  }
}
```

### **✅ API Endpoints (Working)**
- ✅ `POST /api/auth/register` - Registration with OTP
- ✅ `POST /api/auth/login` - Login with OTP  
- ✅ `POST /api/auth/verify-otp` - OTP verification
- ✅ `POST /api/auth/resend-otp` - Resend OTP
- ✅ `POST /api/auth/forgot-password` - Password reset
- ✅ `GET /api/auth/debug-otp/:email` - Debug OTP (dev only)

---

## 🧪 **Testing Instructions**

### **Quick Backend Test (Use this while frontend starting):**

Open PowerShell and run:
```powershell
$body = @{
    name = "Test User $(Get-Date -Format 'HHmmss')"
    email = "test$(Get-Date -Format 'HHmmss')@example.com"
    password = "test123"
    mobile = "987654$(Get-Random -Maximum 9999)"
    year = "3rd"
    department = "Computer Engineering"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

You should see:
- ✅ Success response with email
- 🔔 OTP displayed in server terminal

---

## 🚨 **Troubleshooting**

### **If Frontend Won't Start:**
```bash
# Clear node modules and reinstall
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

### **If API Calls Fail:**
1. Check both servers are running:
   - Backend: http://localhost:5000 ✅
   - Frontend: http://localhost:5173 ❓

2. Check CORS errors in browser console
3. Verify proxy configuration in vite.config.js

### **If OTP Not Showing:**
- OTPs are now logged in **server terminal** with big headers:
```
🔔 ===== REGISTRATION OTP =====
📧 Email: user@example.com
🔢 OTP: 123456
⏰ Expires: 2025-08-30T13:15:00.000Z
🔔 ============================
```

---

## 🎯 **Expected Results**

### **When Everything Works:**

1. **Frontend (port 5173)**: Registration form submits successfully
2. **Backend (port 5000)**: Shows OTP in terminal with big header
3. **Gmail**: Sends actual email (if configured)
4. **Database**: User created with OTP stored
5. **OTP Verification**: Works with terminal OTP or email OTP

### **Success Flow:**
```
User fills form → Frontend POST to /api/auth/register → 
Backend creates user → OTP generated → 
OTP logged in terminal → Email sent → 
User enters OTP → Login successful
```

---

## 🔥 **Quick Start Commands**

**Terminal 1 (Backend):**
```bash
cd C:\Users\Nihar\Documents\GitHub\DAIICT_CODE_CANVAS\server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd C:\Users\Nihar\Documents\GitHub\DAIICT_CODE_CANVAS\frontend  
npm run dev
```

**Browser:**
```
http://localhost:5173
```

---

## ✅ **Verification Checklist**

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173  
- [ ] Registration form accessible
- [ ] Form submission works
- [ ] OTP appears in server terminal
- [ ] OTP verification works
- [ ] Login flow completes

**Once you complete these steps, your auth system will be fully functional!** 🎉
