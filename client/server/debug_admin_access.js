const jwt = require("jsonwebtoken");
const User = require('./models/User');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Debug admin access
const debugAdminAccess = async (email, token = null) => {
  console.log('\n🔍 ===== ADMIN ACCESS DEBUG =====');
  console.log(`📧 Checking admin access for: ${email}`);
  
  try {
    // 1. Check user in database
    console.log('\n1️⃣ Checking database...');
    const user = await User.findOne({ email }).select('-password');
    
    if (!user) {
      console.log('❌ User not found in database');
      return;
    }
    
    console.log('✅ User found in database:');
    console.log(`   ID: ${user._id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   isAdmin: ${user.isAdmin}`);
    console.log(`   isActive: ${user.isActive}`);
    console.log(`   isVerified: ${user.isVerified}`);
    
    // 2. Check JWT token if provided
    if (token) {
      console.log('\n2️⃣ Checking JWT token...');
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ JWT token is valid:');
        console.log(`   User ID: ${decoded.userId || decoded.id}`);
        console.log(`   Email: ${decoded.email}`);
        console.log(`   isAdmin in token: ${decoded.isAdmin}`);
        
        // Compare token data with database
        const userIdInToken = decoded.userId || decoded.id;
        if (userIdInToken !== user._id.toString()) {
          console.log('⚠️  WARNING: User ID in token doesn\'t match database');
        }
        if (decoded.isAdmin !== user.isAdmin) {
          console.log('⚠️  WARNING: isAdmin in token doesn\'t match database');
          console.log(`   Token says isAdmin: ${decoded.isAdmin}`);
          console.log(`   Database says isAdmin: ${user.isAdmin}`);
        }
      } catch (jwtError) {
        console.log('❌ JWT token verification failed:', jwtError.message);
      }
    } else {
      console.log('\n2️⃣ No JWT token provided to check');
    }
    
    // 3. Simulate middleware check
    console.log('\n3️⃣ Simulating middleware checks...');
    console.log(`✅ protect middleware would work: User exists`);
    
    if (user.isAdmin) {
      console.log('✅ adminOnly middleware would pass: User is admin');
    } else {
      console.log('❌ adminOnly middleware would fail: User is not admin');
    }
    
    // 4. Generate fresh token for testing
    console.log('\n4️⃣ Generating fresh token for testing...');
    const freshToken = jwt.sign(
      { userId: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log('✅ Fresh token generated successfully');
    console.log(`🔑 Token: ${freshToken}`);
    
    // 5. Recommendations
    console.log('\n5️⃣ Recommendations:');
    if (!user.isAdmin) {
      console.log('❗ Make user admin in database first');
    }
    if (!user.isActive) {
      console.log('❗ User account is inactive - activate it');
    }
    if (!user.isVerified) {
      console.log('❗ User account is not verified - verify it');
    }
    if (user.isAdmin && user.isActive && user.isVerified) {
      console.log('✅ User should have admin access - check frontend logic');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
  
  console.log('\n🔍 ===== DEBUG COMPLETE =====\n');
};

// Make user admin
const makeAdmin = async (email) => {
  console.log(`\n🔧 Making ${email} an admin...`);
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { 
        isAdmin: true,
        isActive: true,
        isVerified: true,
        'permissions.canViewUsers': true,
        'permissions.canEditUsers': true,
        'permissions.canDeleteUsers': true,
        'permissions.canManagePlants': true,
        'permissions.canViewAnalytics': true
      },
      { new: true }
    );
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User updated successfully:');
    console.log(`   isAdmin: ${user.isAdmin}`);
    console.log(`   isActive: ${user.isActive}`);
    console.log(`   isVerified: ${user.isVerified}`);
    console.log(`   All permissions granted`);
  } catch (error) {
    console.error('❌ Failed to make admin:', error.message);
  }
};

// Main function
const main = async () => {
  await connectDB();
  
  const args = process.argv.slice(2);
  const command = args[0];
  const email = args[1];
  const token = args[2];
  
  if (!email) {
    console.log('Usage:');
    console.log('  node debug_admin_access.js check <email> [token]');
    console.log('  node debug_admin_access.js makeadmin <email>');
    process.exit(1);
  }
  
  if (command === 'check') {
    await debugAdminAccess(email, token);
  } else if (command === 'makeadmin') {
    await makeAdmin(email);
    await debugAdminAccess(email);
  } else {
    console.log('❌ Invalid command. Use "check" or "makeadmin"');
  }
  
  process.exit(0);
};

main().catch(console.error);
