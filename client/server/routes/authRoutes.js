const express = require("express");
const { register, verifyOTP, resendOTP, verifyResetToken, login, forgotPassword, resetPassword, debugGetOTP } = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/verify-reset-token", verifyResetToken);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Development only - get user's current OTP for testing
router.get("/debug-otp/:email", debugGetOTP);

module.exports = router;
