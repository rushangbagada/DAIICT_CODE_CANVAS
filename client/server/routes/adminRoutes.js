
const express = require('express');
const router = express.Router();
const userAdminController = require('../controllers/admin/userAdminController');
const { protect } = require('../middlewares/authMiddleware');

// Admin middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

// GET /admin/users - List all users (Admin only)
router.get('/users', protect, adminOnly, userAdminController.getAllUsers);

// GET /admin/users/:id - Get user by ID (Admin only)
router.get('/users/:id', protect, adminOnly, userAdminController.getUserById);

// PUT /admin/users/:id - Update user (Admin only)
router.put('/users/:id', protect, adminOnly, userAdminController.updateUser);

// DELETE /admin/users/:id - Delete user (Admin only)
router.delete('/users/:id', protect, adminOnly, userAdminController.deleteUser);

// GET /admin/dashboard/statistics - Get dashboard statistics (Admin only)
router.get('/dashboard/statistics', protect, adminOnly, async (req, res) => {
  try {
    // You can customize these statistics based on your needs
    const User = require('../models/User'); // Adjust path if needed
    
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const adminUsers = await User.countDocuments({ isAdmin: true });
    
    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        verifiedUsers,
        adminUsers,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Dashboard statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

// DEBUG: Test admin access (Admin only)
router.get('/test-access', protect, adminOnly, (req, res) => {
  res.json({
    message: 'Admin access working correctly!',
    user: {
      id: req.user._id,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      isActive: req.user.isActive,
      isVerified: req.user.isVerified
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
