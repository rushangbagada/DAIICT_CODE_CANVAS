const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken"); // Add this line
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const Gallery = require("./models/gallery");
const User = require("./models/User");
const Review = require("./models/review");
const Match = require("./models/match");
const Old_match = require("./models/old_match");
const Club = require("./models/club");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.send("API is running"));

app.get("/api/gallery", async (req, res) => {
  try {
    const data = await Gallery.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

app.put("/api/gallery/update", async (req, res) => {
  try {
    const { id, likes, views } = req.body;
    const result = await Gallery.updateOne({ id }, { $set: { likes, views } });
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Success" });
    } else {
      res.status(500).json({ message: "Error" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, mobile, year, department } = req.body;
    const existing_user = await User.findOne({ $or: [{ mobile }, { email }] });
    if (existing_user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ name, email, mobile, year, department });
    const savedUser = await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: savedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Reviews API
app.get("/api/review", (req, res) => {
  Review.find({})
    .then((reviews) => res.json(reviews))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Server error", error: err });
    });
});

// Match Results API with filtering
app.get("/api/result", (req, res) => {
  const { sport, time } = req.query;
  const filter = {};

  // Filter by sport
  if (sport !== "All Sports") {
    filter.category = sport;
  }

  // Filter by time
  const now = new Date();

  if (time === "This Month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    filter.date = { $gte: start, $lte: end };
  } else if (time === "This Season") {
    const start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    filter.date = { $gte: start, $lte: now };
  }

  // Query DB
  Match.find(filter)
    .then(matches => res.json(matches))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
});

// Upcoming Matches API
app.get("/api/upcoming_matches", (req, res) => {
  Old_match.find()
    .then(matches => res.json(matches))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
});

// Recent Matches API
app.get("/api/recent_matches", (req, res) => {
  const sorted_data = Match.find().sort({ date: -1 }).limit(3);
  sorted_data
    .then(matches => res.json(matches))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
});

// Clubs API with filtering - authentication removed
app.get("/api/clubs", async (req, res) => {
  try {
    console.log('Fetching clubs with query:', req.query);
    // Authentication check removed
    const filter = {};
    if (req.query.type && req.query.type !== "All") {
      filter.type = req.query.type;
    }
    
    console.log('Using filter:', filter);
    const clubs = await Club.find(filter).lean();
    console.log('Clubs found:', clubs.length);
    
    if (!clubs || clubs.length === 0) {
      console.log('No clubs found in database');
    } else {
      console.log('First club:', clubs[0]);
    }
    
    res.json(clubs || []);
  } catch (err) {
    console.error('Error fetching clubs:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add a new endpoint for club leaders to get their club
app.get("/api/clubs/my-club", async (req, res) => {
  try {
    // Check for authentication token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Verify the token and get the user ID
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (user.role !== 'club_leader' || !user.club) {
        return res.status(403).json({ message: "Forbidden - Not a club leader or no club assigned" });
      }
      
      const club = await Club.findById(user.club);
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
      
      res.json(club);
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      return res.status(403).json({ message: "Invalid token" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Facts API
const Facts = require("./models/facts");

app.get("/api/funfacts", async (req, res) => {
  try {
    const facts = await Facts.find({});
    res.json(facts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Stats API (if needed by your frontend)
const Stats = require("./models/web_stats");

app.get("/api/stats", async (req, res) => {
  try {
    const stats = await Stats.find({});
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Add this new endpoint for matches
app.get("/api/matches", async (req, res) => {
  try {
    const matches = await Match.find({});
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Import additional models
const News = require("./models/news");
const Live_Match = require("./models/live_match");
const Prediction_Match = require("./models/prediction_match");
const Prediction_user = require("./models/prediction_user");
const Player_user = require("./models/player_user");
const ClubDetail = require("./models/club-detail");
const Club_player = require("./models/club-player");

// Live Matches API
app.get("/api/live-matches", (req, res) => {
  Live_Match.find({ status: "live" })
    .then(matches => res.json(matches))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
});

// Single Live Match API
app.get("/api/live-matches/:id", (req, res) => {
  Live_Match.findById(req.params.id)
    .then(match => {
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      res.json(match);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
});

// Match by ID API
app.get("/api/match/:id", async (req, res) => {
  try {
    const matchId = req.params.id;

    // First try live matches
    let match = await Live_Match.findOne({ id: matchId });

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Return full match with stats and events
    res.json(match);
  } catch (err) {
    console.error("Error fetching match:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Prediction Match API
app.get("/api/prediction_match", (req, res) => {
  Prediction_Match.find()
    .then(matches => res.json(matches))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
});

// User Prediction API
app.get("/api/user", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  Prediction_user.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
});

// Leaderboard API
app.get("/api/leader", (req, res) => {
  Prediction_user.find()
    .then(leader => res.json(leader))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
});

// Player Leaderboard API
app.get("/api/leaderboard", (req, res) => {
  Player_user.find()
    .then(leaderboard => res.json(leaderboard))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    });
});

// Club Details API
app.get("/api/club-details/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const club = await ClubDetail.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }
    res.json(club);
  } catch (err) {
    console.error("Error fetching club by ID:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Club Players API
app.get("/api/club_players/:name", async (req, res) => {
  const { name } = req.params;
  if (!name) return res.status(400).json({ message: "Club name required" });

  try {
    const players = await Club_player.find({ club: { $regex: new RegExp(`^${name}$`, 'i') } });
    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Recent Matches by Category API
app.get("/api/recent_matches/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const matches = await Match.find({ category: name }).sort({ date: -1 }).limit(10);
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Upcoming Matches by Category API
app.get("/api/upcoming_matches/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const matches = await Old_match.find({ category: name }).sort({ date: 1 }).limit(10);
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// News API
app.get("/api/news", async (req, res) => {
  try {
    const news = await News.find({}).sort({ date: -1 });
    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));