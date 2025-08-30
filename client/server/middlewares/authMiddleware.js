const jwt = require("jsonwebtoken");
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch full user data  
    const userId = decoded.userId || decoded.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = user;
    req.userId = userId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: "Invalid token" });
  }
};
