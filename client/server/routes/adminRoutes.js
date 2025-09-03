
const express = require('express');
const mongoose = require('mongoose');
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

// GET /admin/dashboard/stats - Get dashboard statistics (Admin only)
router.get('/dashboard/stats', protect, adminOnly, async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      // Return mock data when database is not connected
      return res.json({
        success: true,
        data: {
          totalUsers: 0,
          activeUsers: 0,
          verifiedUsers: 0,
          adminUsers: 1,
          timestamp: new Date().toISOString(),
          note: "Database not connected - showing mock data"
        }
      });
    }

    const User = require('../models/User');
    
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
    console.error('Dashboard stats error:', error);
    // Return mock data on error to prevent UI from breaking
    res.json({
      success: true,
      data: {
        totalUsers: 0,
        activeUsers: 0,
        verifiedUsers: 0,
        adminUsers: 1,
        timestamp: new Date().toISOString(),
        note: "Error occurred - showing mock data"
      }
    });
  }
});

// GET /admin/dashboard/statistics - Alternative endpoint for dashboard statistics
router.get('/dashboard/statistics', protect, adminOnly, async (req, res) => {
  try {
    const User = require('../models/User');
    
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
