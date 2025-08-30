const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  mobile: {
    type: String,
    trim: true
  },
  year: {
    type: String,
    enum: ['1st', '2nd', '3rd', '4th', 'Alumni', 'Faculty', 'Other']
  },
  department: {
    type: String,
    enum: [
      'Computer Engineering',
      'Information Technology', 
      'Electronics & Communication',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Chemical Engineering',
      'Biomedical Engineering',
      'Environmental Engineering',
      'Management Studies',
      'Other'
    ]
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  permissions: {
    canViewUsers: { type: Boolean, default: false },
    canEditUsers: { type: Boolean, default: false },
    canDeleteUsers: { type: Boolean, default: false },
    canManagePlants: { type: Boolean, default: false },
    canViewAnalytics: { type: Boolean, default: false }
  },
  profile: {
    avatar: String,
    bio: String,
    interests: [String],
    socialLinks: {
      linkedin: String,
      github: String,
      website: String
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  loginCount: { type: Number, default: 0 },
  otp: String,
  otpExpires: Date,
  resetToken: String,
  resetExpires: Date,
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model("User", userSchema);
