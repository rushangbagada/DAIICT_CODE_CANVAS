# Sports Hub Backend API

A comprehensive backend API for the Campus Sports Hub application with authentication, sports management, and user features.

## Features

### 🔐 Authentication System
- User registration with email/mobile validation
- Login with OTP verification
- Password reset functionality
- JWT token-based authentication
- Email notifications via nodemailer
- **Role-based access control** (user, admin, super_admin)

### 🏆 Sports Management
- **Clubs Management**: Different sports clubs with categories
- **Match Results**: Completed matches with scores and MVPs
- **Upcoming Matches**: Scheduled matches with venues and times
- **Gallery**: Sports event photos with engagement metrics
- **Reviews**: User testimonials and feedback

### 👑 Admin Panel
- **Dashboard**: Statistics and overview
- **CRUD Operations**: Create, read, update, delete for all data
- **User Management**: Manage user roles and status
- **Content Management**: Manage clubs, matches, reviews, gallery
- **Role-based Permissions**: Different access levels for admin and super admin

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (sends OTP)
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset with token

### User Management
- `POST /api/register` - Simple user registration (name, email, mobile, year, department)

### Gallery
- `GET /api/gallery` - Get all gallery items
- `PUT /api/gallery/update` - Update likes/views for gallery items

### Clubs
- `GET /api/clubs` - Get all clubs
- `GET /api/clubs?type=Team Sports` - Filter clubs by type

### Matches
- `GET /api/result` - Get match results with filtering
  - Query params: `sport` (sport category), `time` (This Month/This Season)
- `GET /api/upcoming_matches` - Get scheduled matches
- `GET /api/recent_matches` - Get 3 most recent matches

### Reviews
- `GET /api/review` - Get all user reviews/testimonials

### Admin Panel (Protected Routes)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `POST /api/admin/clubs` - Create new club
- `PUT /api/admin/clubs/:id` - Update club
- `DELETE /api/admin/clubs/:id` - Delete club
- `POST /api/admin/matches` - Create new match
- `PUT /api/admin/matches/:id` - Update match
- `DELETE /api/admin/matches/:id` - Delete match
- `POST /api/admin/upcoming-matches` - Create upcoming match
- `PUT /api/admin/upcoming-matches/:id` - Update upcoming match
- `DELETE /api/admin/upcoming-matches/:id` - Delete upcoming match
- `POST /api/admin/reviews` - Create new review
- `PUT /api/admin/reviews/:id` - Update review
- `DELETE /api/admin/reviews/:id` - Delete review
- `POST /api/admin/gallery` - Create gallery item
- `PUT /api/admin/gallery/:id` - Update gallery item
- `DELETE /api/admin/gallery/:id` - Delete gallery item
- `GET /api/admin/users` - Get all users (super admin only)
- `PUT /api/admin/users/:id/role` - Update user role (super admin only)
- `PUT /api/admin/users/:id/toggle-status` - Toggle user status (super admin only)

## Database Models

### User
```javascript
{
  name: String (required),
  email: String (required),
  password: String (required),
  mobile: String,
  year: String,
  department: String,
  role: String (enum: 'user', 'admin', 'super_admin', default: 'user'),
  isActive: Boolean (default: true),
  otp: String,
  otpExpires: Date,
  resetToken: String,
  resetExpires: Date
}
```

### Club
```javascript
{
  name: String (required),
  description: String (required),
  image: String (required),
  players: Number (required),
  matches: Number (required),
  type: String (required) // Team Sports, Racket Sports, Individual Sports
}
```

### Match (Completed)
```javascript
{
  team1: String (required),
  team2: String (required),
  date: Date (required),
  venue: String (required),
  category: String (required),
  team1_score: Number (required),
  team2_score: Number (required),
  mvp: String (required)
}
```

### Old_match (Upcoming)
```javascript
{
  team1: String (required),
  team2: String (required),
  date: Date (required),
  venue: String (required),
  time: String (required),
  category: String (required)
}
```

### Review
```javascript
{
  name: String (required),
  image: String (required),
  position: String (required),
  review: String (required)
}
```

### Gallery
```javascript
{
  id: Number (required),
  title: String (required),
  image: String (required),
  description: String,
  category: String (required),
  likes: Number,
  views: Number
}
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/sports-hub
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

3. **Initialize Database**
   ```bash
   # Initialize all data at once
   npm run init-all
   
   # Or initialize individually
   npm run init-clubs
   npm run init-matches
   npm run init-upcoming
   npm run init-reviews
   ```

4. **Create Admin User**
   ```bash
   npm run create-admin
   ```
   This creates a super admin user with:
   - Email: admin@sportshub.com
   - Password: admin123
   - Role: super_admin

4. **Start Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run init-all` - Initialize all sample data
- `npm run init-clubs` - Initialize clubs data only
- `npm run init-matches` - Initialize match results only
- `npm run init-upcoming` - Initialize upcoming matches only
- `npm run init-reviews` - Initialize reviews only
- `npm run create-admin` - Create super admin user

## Sample Data

The initialization scripts will populate the database with:

- **6 Sports Clubs**: Basketball, Tennis, Badminton, Swimming, Football, Cricket
- **6 Match Results**: Recent completed matches with scores
- **6 Upcoming Matches**: Scheduled matches for future dates
- **6 User Reviews**: Testimonials from club members

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Nodemailer** - Email notifications
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## API Response Format

All API responses follow this format:
```javascript
{
  "message": "Success/Error message",
  "data": {}, // Optional data payload
  "error": {} // Optional error details
}
```

## Error Handling

The API includes comprehensive error handling for:
- Database connection errors
- Validation errors
- Authentication failures
- Network errors
- Invalid requests

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Email verification for login
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS configuration
- Environment variable protection
- Admin middleware protection

## Role-Based Access Control

### User Roles
- **user**: Regular user with basic access
- **admin**: Can manage all content (clubs, matches, reviews, gallery)
- **super_admin**: Can manage everything including users and roles

### Admin Permissions
- **Admin**: Full CRUD access to clubs, matches, reviews, gallery
- **Super Admin**: All admin permissions + user management 