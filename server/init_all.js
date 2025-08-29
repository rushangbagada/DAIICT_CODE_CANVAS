const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Club = require('./models/club');
const Match = require('./models/match');
const Old_match = require('./models/old_match');
const Review = require('./models/review');
const News = require('./models/news');
const Facts = require('./models/facts');
const Live_Match = require('./models/live_match');

connectDB();

// Sample data for all models
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

const all_reviews = [
  {
    name: "John Smith",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    position: "Basketball Captain",
    review: "Amazing experience with the sports hub! The facilities are top-notch and the community is very supportive. I've improved my skills significantly since joining."
  },
  {
    name: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    position: "Tennis Player",
    review: "The tennis club has been incredible. Great coaching staff and regular tournaments keep me motivated. Highly recommend for anyone interested in tennis!"
  },
  {
    name: "Mike Davis",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    position: "Football Team Member",
    review: "Best sports community I've ever been part of. The football team is like a family, and we've won several inter-college tournaments together."
  },
  {
    name: "Lisa Chen",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    position: "Badminton Champion",
    review: "The badminton facilities are excellent and the competition is fierce. I've made great friends and improved my game tremendously."
  },
  {
    name: "Rahul Sharma",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    position: "Cricket Team Captain",
    review: "Fantastic cricket ground and equipment. The team spirit is amazing and we've had some memorable matches. Great place for cricket enthusiasts!"
  },
  {
    name: "Emma Wilson",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    position: "Swimming Coach",
    review: "The swimming pool is well-maintained and the coaching program is excellent. Students of all levels can learn and improve here."
  }
];

// Add sample news data
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
  }
];

// Add sample facts data
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
  }
];

// Add sample live matches data
const sampleLiveMatches = [
  {
    id: '1',
    sport: 'Basketball',
    team1: 'Engineering Eagles',
    team2: 'Business Bears',
    team1_score: 78,
    team2_score: 82,
    status: 'live',
    time: '3rd Quarter - 8:45',
    venue: 'Main Gymnasium',
    url: 'https://www.youtube.com/embed/l88pZnG-2S0',
    events: [
      {
        time: '2nd Quarter',
        type: 'score',
        team: 'Engineering Eagles',
        player: 'John Smith',
        description: '3-point shot'
      },
      {
        time: '1st Quarter',
        type: 'foul',
        team: 'Business Bears',
        player: 'Mike Johnson',
        description: 'Personal foul'
      }
    ],
    stats: {
      possession: { home: 45, away: 55 },
      shots: { home: 32, away: 28 },
      shots_on_target: { home: 18, away: 15 },
      fouls: { home: 8, away: 12 }
    }
  },
  {
    id: '2',
    sport: 'Soccer',
    team1: 'Arts Arrows',
    team2: 'Science Sharks',
    team1_score: 2,
    team2_score: 1,
    status: 'live',
    time: '78\'',
    venue: 'Campus Field',
    url: 'https://www.youtube.com/embed/l88pZnG-2S0',
    events: [
      {
        time: '45\'',
        type: 'goal',
        team: 'Arts Arrows',
        player: 'Emily Parker',
        description: 'Goal scored from penalty kick'
      },
      {
        time: '22\'',
        type: 'goal',
        team: 'Science Sharks',
        player: 'Lisa Brown',
        description: 'Goal from free kick'
      }
    ],
    stats: {
      possession: { home: 58, away: 42 },
      shots: { home: 12, away: 8 },
      shots_on_target: { home: 5, away: 3 },
      fouls: { home: 7, away: 11 }
    }
  }
];

// Initialize all data
async function initializeAllData() {
  try {
    console.log("🚀 Starting data initialization...");

    // Clear existing data
    await Club.deleteMany({});
    await Match.deleteMany({});
    await Old_match.deleteMany({});
    await Review.deleteMany({});
    await News.deleteMany({});
    await Facts.deleteMany({});
    await Live_Match.deleteMany({});

    console.log("🗑️  Cleared existing data");

    // Insert new data
    const clubs = await Club.insertMany(all_clubs);
    const matches = await Match.insertMany(all_matches);
    const upcomingMatches = await Old_match.insertMany(upcoming_matches);
    const reviews = await Review.insertMany(all_reviews);
    const news = await News.insertMany(sampleNews);
    const facts = await Facts.insertMany(sampleFacts);
    const liveMatches = await Live_Match.insertMany(sampleLiveMatches);

    console.log("✅ Data initialization completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Clubs: ${clubs.length}`);
    console.log(`   - Matches: ${matches.length}`);
    console.log(`   - Upcoming Matches: ${upcomingMatches.length}`);
    console.log(`   - Reviews: ${reviews.length}`);
    console.log(`   - News: ${news.length}`);
    console.log(`   - Facts: ${facts.length}`);
    console.log(`   - Live Matches: ${liveMatches.length}`);

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error initializing data:", error);
    process.exit(1);
  }
}

initializeAllData();