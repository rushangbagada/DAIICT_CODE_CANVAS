// Admin user management routes for Green Hydrogen
const express = require('express');
const router = express.Router();
const userAdminController = require('../controllers/admin/userAdminController');

// GET /admin/users - List all users
router.get('/users', userAdminController.getAllUsers);

// GET /admin/users/:id - Get user by ID
router.get('/users/:id', userAdminController.getUserById);

// PUT /admin/users/:id - Update user
router.put('/users/:id', userAdminController.updateUser);

// DELETE /admin/users/:id - Delete user
router.delete('/users/:id', userAdminController.deleteUser);

module.exports = router;
