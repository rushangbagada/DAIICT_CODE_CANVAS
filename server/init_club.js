const mongoose = require('mongoose');
const Club = require('./models/club');
const connectDB = require('./config/db');

connectDB();

const all_clubs = [
  {
    name: "Basketball Club",
    description: "Join our basketball club for competitive matches and training sessions. Open to all skill levels.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba8d0ef82c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
    players: 25,
    matches: 12,
    type: "Team Sports"
  },
  {
    name: "Tennis Club",
    description: "Professional tennis coaching and regular tournaments. Singles and doubles matches available.",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80",
    players: 18,
    matches: 8,
    type: "Racket Sports"
  },
  {
    name: "Badminton Club",
    description: "Fast-paced badminton games and tournaments. Equipment provided for beginners.",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80",
    players: 32,
    matches: 15,
    type: "Racket Sports"
  },
  {
    name: "Swimming Club",
    description: "Swimming lessons and competitive training. Multiple skill levels from beginner to advanced.",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80",
    players: 40,
    matches: 6,
    type: "Individual Sports"
  },
  {
    name: "Football Club",
    description: "Campus football team with regular practice sessions and inter-college tournaments.",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80",
    players: 35,
    matches: 20,
    type: "Team Sports"
  },
  {
    name: "Cricket Club",
    description: "Traditional cricket matches and training. Both T20 and longer format games.",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80",
    players: 28,
    matches: 10,
    type: "Team Sports"
  }
];

Club.insertMany(all_clubs)
  .then((res) => {
    console.log("✅ Clubs initialized successfully:", res.length, "clubs added");
    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ Error initializing clubs:", err);
    process.exit(1);
  }); 