const mongoose = require('mongoose');
const Live_Match = require('./models/live_match');
const connectDB = require('./config/db');

connectDB();

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
      },
      {
        time: '1st Quarter',
        type: 'score',
        team: 'Business Bears',
        player: 'Sarah Davis',
        description: 'Layup'
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
        time: '38\'',
        type: 'card',
        team: 'Science Sharks',
        player: 'David Wilson',
        description: 'Yellow card for unsporting behavior'
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
  },
  {
    id: '3',
    sport: 'Volleyball',
    team1: 'Medical Mavericks',
    team2: 'Law Lions',
    team1_score: 2,
    team2_score: 1,
    status: 'live',
    time: 'Set 4',
    venue: 'Sports Hall B',
    url: 'https://www.youtube.com/embed/l88pZnG-2S0',
    events: [
      {
        time: 'Set 3',
        type: 'point',
        team: 'Medical Mavericks',
        player: 'Alex Turner',
        description: 'Ace serve'
      },
      {
        time: 'Set 2',
        type: 'substitution',
        team: 'Law Lions',
        player: 'Chris Martin',
        description: 'Player substitution'
      },
      {
        time: 'Set 1',
        type: 'point',
        team: 'Law Lions',
        player: 'Jessica Lee',
        description: 'Spike point'
      }
    ],
    stats: {
      possession: { home: 55, away: 45 },
      shots: { home: 45, away: 42 },
      shots_on_target: { home: 32, away: 28 },
      fouls: { home: 3, away: 5 }
    }
  }
];

async function initializeLiveMatches() {
  try {
    console.log("🚀 Starting live match data initialization...");
    
    // Clear existing data
    await Live_Match.deleteMany({});
    console.log("🗑️  Cleared existing live match data");
    
    // Insert new data
    const liveMatches = await Live_Match.insertMany(sampleLiveMatches);
    
    console.log("✅ Live match data initialization completed successfully!");
    console.log(`📊 Live matches added: ${liveMatches.length}`);
    
    process.exit(0);
  } catch (err) {
    console.log("❌ Error during live match initialization:", err);
    process.exit(1);
  }
}

initializeLiveMatches();