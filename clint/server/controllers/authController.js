const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mailer");

// Reusable OTP sender with better email templates
async function sendOTPEmail(email, otp, subject = "Verify your email", type = "verification") {
  // Check if we're in development mode without email credentials
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`🔧 DEVELOPMENT MODE: Email would be sent to ${email}`);
    console.log(`📧 Subject: ${subject}`);
    console.log(`🔢 OTP/Token: ${otp}`);
    console.log(`📝 Type: ${type}`);
    return; // Skip actual email sending
  }

  let htmlContent = '';
  
  if (type === "verification") {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">🏆 Campus Sports Hub</h1>
            <p style="color: #666; margin: 10px 0;">Email Verification</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin: 0 0 15px 0;">Welcome to Campus Sports Hub!</h2>
            <p style="color: #555; margin: 0 0 20px 0;">Thank you for registering with us. To complete your registration, please verify your email address using the OTP below:</p>
            
            <div style="background-color: #007bff; color: white; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            
            <p style="color: #666; font-size: 14px; margin: 0;">This OTP is valid for 10 minutes. If you didn't request this verification, please ignore this email.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">© 2024 Campus Sports Hub. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  } else if (type === "login") {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">🏆 Campus Sports Hub</h1>
            <p style="color: #666; margin: 10px 0;">Login Verification</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin: 0 0 15px 0;">Complete Your Login</h2>
            <p style="color: #555; margin: 0 0 20px 0;">To complete your login, please enter the OTP below:</p>
            
            <div style="background-color: #28a745; color: white; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            
            <p style="color: #666; font-size: 14px; margin: 0;">This OTP is valid for 10 minutes. If you didn't request this login, please ignore this email.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">© 2024 Campus Sports Hub. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  } else if (type === "reset") {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">🏆 Campus Sports Hub</h1>
            <p style="color: #666; margin: 10px 0;">Password Reset</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin: 0 0 15px 0;">Password Reset Request</h2>
            <p style="color: #555; margin: 0 0 20px 0;">We received a request to reset your password. Use the reset token below to create a new password:</p>
            
            <div style="background-color: #dc3545; color: white; padding: 15px; border-radius: 5px; text-align: center; font-size: 20px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
              ${otp}
            </div>
            
            <p style="color: #666; font-size: 14px; margin: 0;">This token is valid for 10 minutes. If you didn't request a password reset, please ignore this email.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">© 2024 Campus Sports Hub. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  }

  try {
    await transporter.sendMail({
      to: email,
      subject,
      html: htmlContent,
    });
    console.log(`✅ Email sent successfully to ${email}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    // Don't throw error in development mode
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
}

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, mobile, year, department } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Check if mobile number already exists
    if (mobile) {
      const existingMobile = await User.findOne({ mobile });
      if (existingMobile) {
        return res.status(400).json({ message: "User with this mobile number already exists" });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate OTP - exactly 6 digits
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Create new user (no email verification required)
    user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      mobile, 
      year, 
      department,
      otp, 
      otpExpires 
    });
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp, "Login OTP - Campus Sports Hub", "login");

    res.status(201).json({ 
      message: "Registration successful. Please check your email for OTP to complete login.",
      email: email
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Resend Login OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate new OTP - exactly 6 digits
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Update user with new OTP
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send new OTP email
    await sendOTPEmail(email, otp, "Login OTP - Campus Sports Hub", "login");

    res.json({ message: "New OTP sent to your email" });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ message: "Server error during resend OTP" });
  }
};

// Verify OTP and complete login
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    res.json({ 
      message: "Login successful",
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        mobile: user.mobile,
        year: user.year,
        department: user.department,
        role: user.role,
        isActive: user.isActive
      } 
    });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
};

// Verify Reset Token
exports.verifyResetToken = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    
    if (user.resetToken !== otp || user.resetExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    res.json({ message: "Reset token verified successfully" });
  } catch (err) {
    console.error('Reset token verification error:', err);
    res.status(500).json({ message: "Server error during reset token verification" });
  }
};

// Login - First step: validate credentials and send OTP
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate OTP - exactly 6 digits
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Update user with new OTP
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp, "Login OTP - Campus Sports Hub", "login");

    res.json({ 
      message: "OTP sent to your email. Please verify to complete login.",
      email: email
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: "No account found with this email address" });
    }

    // Generate reset token - exactly 6 digits
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetToken = resetToken;
    user.resetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send reset email
    await sendOTPEmail(email, resetToken, "Password Reset - Campus Sports Hub", "reset");

    res.json({ message: "Password reset token sent to your email" });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: "Server error during password reset request" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    
    if (user.resetToken !== resetToken || user.resetExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now login with your new password." });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: "Server error during password reset" });
  }
};
