const mongoose = require('mongoose');
const News = require('./models/news');
const connectDB = require('./config/db');

connectDB();

const sampleNews = [
  {
    title: "Campus Basketball Tournament Announced",
    image: "https://images.unsplash.com/photo-1546519638-68e109acd27d",
    description: "The annual campus basketball tournament will begin next month. Registration is now open for all departments.",
    date: new Date(2023, 5, 15),
    category: "Basketball"
  },
  {
    title: "Swimming Team Wins Regional Championship",
    image: "https://images.unsplash.com/photo-1560089000-7433a4ebbd64",
    description: "Our campus swimming team has won the regional championship for the third consecutive year.",
    date: new Date(2023, 4, 28),
    category: "Swimming"
  },
  {
    title: "New Sports Facilities Opening Soon",
    image: "https://images.unsplash.com/photo-1470299568568-d4e15c4e6e1c",
    description: "The university is opening new state-of-the-art sports facilities next semester, including an Olympic-sized swimming pool and indoor basketball courts.",
    date: new Date(2023, 6, 10),
    category: "Campus"
  },
  {
    title: "Football Team Tryouts Next Week",
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68",
    description: "Tryouts for the campus football team will be held next week. All interested students are encouraged to participate.",
    date: new Date(2023, 7, 5),
    category: "Football"
  },
  {
    title: "Tennis Tournament Results",
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0",
    description: "Results from the inter-college tennis tournament are now available. Our team secured second place overall.",
    date: new Date(2023, 3, 20),
    category: "Tennis"
  }
];

async function initializeNews() {
  try {
    console.log("🚀 Starting news data initialization...");
    
    // Clear existing data
    await News.deleteMany({});
    console.log("🗑️  Cleared existing news data");
    
    // Insert new data
    const news = await News.insertMany(sampleNews);
    
    console.log("✅ News data initialization completed successfully!");
    console.log(`📊 Summary: ${news.length} news articles created`);
    
    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error initializing news data:", error);
    process.exit(1);
  }
}

initializeNews();