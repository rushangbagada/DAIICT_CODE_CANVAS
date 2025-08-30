// Admin password utility for Green Hydrogen admin panel
const bcrypt = require('bcryptjs');

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

exports.verifyAdminPassword = async (password) => {
  if (!ADMIN_PASSWORD_HASH) return false;
  return await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
};

exports.setAdminPassword = async (newPassword) => {
  const hash = await bcrypt.hash(newPassword, 10);
  // Save this hash to your .env or a secure config (manual step)
  return hash;
};
