const mongoose = require('mongoose');
const Facts = require('./models/facts');
const connectDB = require('./config/db');

connectDB();

const sampleFacts = [
  {
    id: 1,
    title: "Oldest Sport",
    description: "Wrestling is considered the world's oldest competitive sport, dating back to 3000 BC.",
    image: "🤼",
    category: "Sports",
    date: new Date()
  },
  {
    id: 2,
    title: "Fastest Ball",
    description: "The fastest recorded tennis serve was by Sam Groth at 263.4 km/h (163.7 mph).",
    image: "🎾",
    category: "Sports",
    date: new Date()
  },
  {
    id: 3,
    title: "Most Played Team Sport",
    description: "Football (soccer) is the most played and watched sport in the world.",
    image: "⚽",
    category: "Sports",
    date: new Date()
  },
  {
    id: 4,
    title: "Olympic Debut",
    description: "Basketball was first included in the Olympic Games in 1936.",
    image: "🏀",
    category: "Sports",
    date: new Date()
  },
  {
    id: 5,
    title: "Longest Match",
    description: "The longest tennis match lasted 11 hours and 5 minutes at Wimbledon 2010.",
    image: "⏱️",
    category: "Sports",
    date: new Date()
  }
];

async function initializeFacts() {
  try {
    console.log("🚀 Starting facts data initialization...");
    
    // Clear existing data
    await Facts.deleteMany({});
    console.log("🗑️  Cleared existing facts data");
    
    // Insert new data
    const facts = await Facts.insertMany(sampleFacts);
    
    console.log("✅ Facts data initialization completed successfully!");
    console.log(`📊 Facts added: ${facts.length}`);
    
    process.exit(0);
  } catch (err) {
    console.log("❌ Error during facts initialization:", err);
    process.exit(1);
  }
}

initializeFacts();