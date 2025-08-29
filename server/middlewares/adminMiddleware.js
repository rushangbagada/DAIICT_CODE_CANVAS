const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is authenticated - now bypassed
const authenticateToken = async (req, res, next) => {
  // Skip authentication - proceed directly
  req.user = { role: 'admin' }; // Set a default admin user
  next();
};

// Middleware to check if user is admin - now always passes
const requireAdmin = (req, res, next) => {
  // Skip admin role check - allow all requests
  next();
};

// Middleware to check if user is a club leader with access to specific resources
const requireClubLeader = (resourceType) => {
  return async (req, res, next) => {
    // Skip club leader checks - allow all requests
    next();
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireClubLeader
};