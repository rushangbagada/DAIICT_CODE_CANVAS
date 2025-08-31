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

// Connect to Database
connectDB();

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/hydrogen-plants", hydrogenPlantsRoutes);
app.use("/api/email", emailRoutes);
app.use("/ml-api/ml", mlRoutes);

// Health check endpoint
app.get("/", (req, res) => res.send("Green Hydrogen Platform API is running"));

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
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Green Hydrogen Platform Server running on port ${PORT}`));
