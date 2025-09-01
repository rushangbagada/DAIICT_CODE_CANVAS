// ...existing code...

// Health check endpoint for keep-alive (must be after app is initialized)
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Temporary debug endpoint to check environment variables
app.get("/debug-env", (req, res) => {
  res.json({
    env: {
      ML_BACKEND_URL: process.env.ML_BACKEND_URL,
      ML_API_KEY: process.env.ML_API_KEY ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT
    },
    timestamp: new Date().toISOString()
  });
});
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const mlRoutes = require("./routes/mlRoutes");
const adminRoutes = require("./routes/adminRoutes");
const hydrogenPlantsRoutes = require("./routes/hydrogenPlants");
const emailRoutes = require("./routes/emailRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:3000',  // React dev server
    'https://daiict-code-canvas-227d-k36yxmdes-rushangbagadas-projects.vercel.app',  // Old Vercel URL
    'https://daiict-code-canvas-kx5kd1ckv-rushangbagadas-projects.vercel.app',  // Previous Vercel URL
    'https://daiict-code-canvas-picci8dnx-rushangbagadas-projects.vercel.app',  // Latest Vercel URL
    'https://daiict-code-canvas.vercel.app'  // Production Vercel URL
  ],
  credentials: true
}));
app.use(express.json());

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Connect to Database
connectDB();

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/hydrogen-plants", hydrogenPlantsRoutes);
app.use("/api/email", emailRoutes);
app.use("/ml-api/ml", mlRoutes);

// Test route for debugging
app.get("/test", (req, res) => {
  res.json({ 
    message: "Express server is working!", 
    timestamp: new Date().toISOString(),
    routes: [
      "/api/auth/*",
      "/api/admin/*", 
      "/api/hydrogen-plants/*",
      "/api/email/*",
      "/ml-api/ml/*"
    ],
    env: {
      ML_BACKEND_URL: process.env.ML_BACKEND_URL,
      ML_API_KEY: process.env.ML_API_KEY ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT
    }
  });
});

// Health check endpoint
app.get("/", (req, res) => res.send("Green Hydrogen Platform API is running - Updated " + new Date().toISOString()));

// ML model status endpoint
app.get("/ml-api/ml/status", (req, res) => {
  res.json({
    status: "active",
    model: "hydrogen-site-recommender",
    description: "ML model for hydrogen site recommendation",
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler - use a proper middleware function
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Green Hydrogen Platform Server running on port ${PORT}`));
