const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

connectDB();

const createAdminUser = async () => {
  try {
    console.log("🚀 Creating admin user...");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'super_admin' });
    if (existingAdmin) {
      console.log("⚠️  Super admin already exists!");
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Role: ${existingAdmin.role}`);
      process.exit(0);
    }

    // Admin user data
    const adminData = {
      name: "Super Admin",
      email: "admin@sportshub.com",
      password: "admin123", // This will be hashed
      mobile: "1234567890",
      year: "Admin",
      department: "Administration",
      role: "super_admin",
      isActive: true
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create admin user
    const adminUser = new User({
      ...adminData,
      password: hashedPassword
    });

    await adminUser.save();

    console.log("✅ Super admin user created successfully!");
    console.log("📧 Email:", adminData.email);
    console.log("🔑 Password:", adminData.password);
    console.log("👑 Role: super_admin");
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  }
};

createAdminUser(); 