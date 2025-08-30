// Script to promote a user to admin (for initial setup)
// Usage: node promoteAdmin.js <user_email>

const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('MongoDB URI not set in .env');
  process.exit(1);
}

const email = process.argv[2];
if (!email) {
  console.error('Usage: node promoteAdmin.js <user_email>');
  process.exit(1);
}

async function promoteAdmin() {
  await mongoose.connect(MONGO_URI);
  const user = await User.findOne({ email });
  if (!user) {
    console.error('User not found');
    process.exit(1);
  }
  user.role = 'admin';
  await user.save();
  console.log(`User ${email} promoted to admin.`);
  process.exit(0);
}

promoteAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
