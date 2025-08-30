const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: {
    type: String
  },
  year: {
    type: String
  },
  department: {
    type: String
  },
  // Removed role and club for green hydrogen admin redesign
  isActive: {
    type: Boolean,
    default: true
  },
  otp: String,
  otpExpires: Date,
  resetToken: String,
  resetExpires: Date,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
