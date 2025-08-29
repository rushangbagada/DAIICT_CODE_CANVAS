const mongoose = require('mongoose');
const Old_match = require('./models/old_match');
const connectDB = require('./config/db');

connectDB();

const upcoming_matches = [
  {
    team1: "Basketball Team A",
    team2: "Basketball Team C",
    date: new Date('2024-03-15'),
    venue: "Main Basketball Court",
    time: "2:00 PM",
    category: "Basketball"
  },
  {
    team1: "Tennis Club A",
    team2: "Tennis Club C",
    date: new Date('2024-03-18'),
    venue: "Tennis Court 2",
    time: "4:00 PM",
    category: "Tennis"
  },
  {
    team1: "Football Team A",
    team2: "Football Team C",
    date: new Date('2024-03-20'),
    venue: "Football Ground",
    time: "6:00 PM",
    category: "Football"
  },
  {
    team1: "Badminton Team A",
    team2: "Badminton Team C",
    date: new Date('2024-03-22'),
    venue: "Badminton Court",
    time: "3:00 PM",
    category: "Badminton"
  },
  {
    team1: "Cricket Team A",
    team2: "Cricket Team C",
    date: new Date('2024-03-25'),
    venue: "Cricket Ground",
    time: "9:00 AM",
    category: "Cricket"
  },
  {
    team1: "Swimming Team A",
    team2: "Swimming Team C",
    date: new Date('2024-03-28'),
    venue: "Swimming Pool",
    time: "5:00 PM",
    category: "Swimming"
  }
];

Old_match.insertMany(upcoming_matches)
  .then((res) => {
    console.log("✅ Upcoming matches initialized successfully:", res.length, "matches added");
    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ Error initializing upcoming matches:", err);
    process.exit(1);
  }); 