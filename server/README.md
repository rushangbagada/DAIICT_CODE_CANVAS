# Sports Hub Authentication Server

A clean and minimal authentication server for the Sports Hub application.

## Features

- **User Registration** with email verification
- **Login** with OTP verification
- **Password Reset** functionality
- **JWT Token** authentication
- **Email Service** for OTP delivery
- **MongoDB** integration

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register a new user
- `POST /login` - Login (sends OTP)
- `POST /verify-otp` - Verify OTP and complete login
- `POST /resend-otp` - Resend OTP
- `POST /forgot-password` - Request password reset
- `POST /verify-reset-token` - Verify reset token
- `POST /reset-password` - Reset password

## Project Structure

```
server/
├── config/
│   ├── db.js           # Database connection
│   └── mailer.js       # Email configuration
├── controllers/
│   └── authController.js # Authentication logic
├── middlewares/
│   └── authMiddleware.js # JWT verification
├── models/
│   └── User.js         # User schema
├── routes/
│   └── authRoutes.js   # Auth route definitions
├── package.json
└── server.js           # Main server file
```

## Environment Variables

Create a `.env` file with:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`

3. Start the server:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Development Mode

In development mode without email credentials, OTP codes will be logged to the console instead of being sent via email.

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT implementation
- **nodemailer** - Email service
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
