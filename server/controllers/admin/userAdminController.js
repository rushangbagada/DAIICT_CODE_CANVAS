// User management controller for Green Hydrogen admin
const User = require('../../models/User');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password -otp -otpExpires -resetToken -resetExpires');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password -otp -otpExpires -resetToken -resetExpires');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, mobile, year, department, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, mobile, year, department, isActive },
      { new: true, runValidators: true, select: '-password -otp -otpExpires -resetToken -resetExpires' }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};
