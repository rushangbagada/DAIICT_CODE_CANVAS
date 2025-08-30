const mongoose = require('mongoose');
const User = require('./client/server/models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables from the server directory
dotenv.config({ path: './client/server/.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const fixAdminAccess = async (email) => {
  console.log(`\n🔧 ===== FIXING ADMIN ACCESS FOR ${email} =====\n`);

  try {
    // 1. Check/Update user in database
    console.log('1️⃣ Checking and updating user in database...');
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
      console.log('❌ User not found in database');
      return;
    }

    console.log('✅ User updated in database:');
    console.log(`   ID: ${user._id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   isAdmin: ${user.isAdmin}`);
    console.log(`   isActive: ${user.isActive}`);
    console.log(`   isVerified: ${user.isVerified}`);

    // 2. Generate fresh token
    console.log('\n2️⃣ Generating fresh authentication token...');
    const freshToken = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    console.log('✅ Fresh token generated');
    console.log(`🔑 New Token: ${freshToken}`);

    // 3. Provide instructions to fix frontend
    console.log('\n3️⃣ Frontend Fix Instructions:');
    console.log('=================================');
    console.log('To fix the frontend issue, do the following:');
    console.log('');
    console.log('OPTION 1 - Clear Browser Cache (Recommended):');
    console.log('1. Open Developer Tools (F12)');
    console.log('2. Go to Application/Storage tab');
    console.log('3. Clear localStorage completely');
    console.log('4. Refresh the page and login again');
    console.log('');
    console.log('OPTION 2 - Use new token in browser console:');
    console.log('1. Open Developer Tools (F12)');
    console.log('2. Go to Console tab');
    console.log('3. Run this command:');
    console.log(`   localStorage.setItem('authToken', '${freshToken}');`);
    console.log('4. Refresh the page');
    console.log('');
    console.log('OPTION 3 - Login again normally:');
    console.log('1. Logout if you\'re logged in');
    console.log('2. Login again with your credentials');
    console.log('3. The new login will fetch fresh user data');

    // 4. Test the /auth/me endpoint
    console.log('\n4️⃣ Testing /auth/me endpoint...');
    console.log('Once the server is running, you can test this endpoint:');
    console.log(`curl -H "Authorization: Bearer ${freshToken}" http://localhost:5000/api/auth/me`);

    // 5. Summary
    console.log('\n5️⃣ Summary:');
    console.log('✅ Database: User is correctly marked as admin');
    console.log('✅ Token: Fresh token generated with admin privileges');
    console.log('✅ Backend: /auth/me endpoint added to fetch current user');
    console.log('✅ Permissions: All admin permissions granted');
    console.log('');
    console.log('🎯 Next steps:');
    console.log('1. Start your server: cd client/server && node server.js');
    console.log('2. Clear frontend cache and login again');
    console.log('3. Access admin dashboard');

  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  }

  console.log('\n🔧 ===== FIX COMPLETE =====\n');
};

const main = async () => {
  await connectDB();
  
  // Get email from command line argument
  const email = process.argv[2];
  
  if (!email) {
    console.log('Usage: node fix_admin_access.js <email>');
    console.log('Example: node fix_admin_access.js rushang697@gmail.com');
    process.exit(1);
  }
  
  await fixAdminAccess(email);
  process.exit(0);
};

main().catch(console.error);
