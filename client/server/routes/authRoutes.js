const express = require("express");
const { register, verifyOTP, resendOTP, verifyResetToken, login, forgotPassword, resetPassword, debugGetOTP } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/verify-reset-token", verifyResetToken);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Get current user (requires authentication)
router.get("/me", protect, (req, res) => {
  // req.user is populated by the protect middleware
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      mobile: req.user.mobile,
      year: req.user.year,
      department: req.user.department,
      isAdmin: req.user.isAdmin,
      isActive: req.user.isActive,
      isVerified: req.user.isVerified,
      permissions: req.user.permissions
    }
  });
});

// Development only - get user's current OTP for testing
router.get("/debug-otp/:email", debugGetOTP);

module.exports = router;
