const mongoose = require('mongoose');
const Match = require('./models/match');
const connectDB = require('./config/db');

connectDB();

const all_matches = [
  {
    team1: "Basketball Team A",
    team2: "Basketball Team B",
    date: new Date('2024-01-15'),
    venue: "Main Basketball Court",
    category: "Basketball",
    team1_score: 85,
    team2_score: 78,
    mvp: "John Smith"
  },
  {
    team1: "Tennis Club A",
    team2: "Tennis Club B",
    date: new Date('2024-01-20'),
    venue: "Tennis Court 1",
    category: "Tennis",
    team1_score: 6,
    team2_score: 4,
    mvp: "Sarah Johnson"
  },
  {
    team1: "Football Team A",
    team2: "Football Team B",
    date: new Date('2024-01-25'),
    venue: "Football Ground",
    category: "Football",
    team1_score: 3,
    team2_score: 1,
    mvp: "Mike Davis"
  },
  {
    team1: "Badminton Team A",
    team2: "Badminton Team B",
    date: new Date('2024-02-01'),
    venue: "Badminton Court",
    category: "Badminton",
    team1_score: 21,
    team2_score: 19,
    mvp: "Lisa Chen"
  },
  {
    team1: "Cricket Team A",
    team2: "Cricket Team B",
    date: new Date('2024-02-05'),
    venue: "Cricket Ground",
    category: "Cricket",
    team1_score: 165,
    team2_score: 142,
    mvp: "Rahul Sharma"
  },
  {
    team1: "Swimming Team A",
    team2: "Swimming Team B",
    date: new Date('2024-02-10'),
    venue: "Swimming Pool",
    category: "Swimming",
    team1_score: 8,
    team2_score: 5,
    mvp: "Emma Wilson"
  }
];

Match.insertMany(all_matches)
  .then((res) => {
    console.log("✅ Matches initialized successfully:", res.length, "matches added");
    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ Error initializing matches:", err);
    process.exit(1);
  }); 