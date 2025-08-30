const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sports-hub-auth';
    
    await mongoose.connect(mongoURI);
    console.log('🗄️  MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('⚠️  Continuing without database connection...');
    // Don't exit, just log the error
  }
};

module.exports = connectDB;
