
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
