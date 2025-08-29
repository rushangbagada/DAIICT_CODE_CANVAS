const mongoose = require('mongoose');

const live_matchSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  sport: {
    type: String,
    required: true
  },
  team1: {
    type: String,
    required: true
  },
  team2: {
    type: String,
    required: true
  },
  team1_score: {
    type: Number,
    default: 0
  },
  team2_score: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['live', 'upcoming', 'finished'],
    default: 'upcoming'
  },
  time: String,
  venue: String,
  url: String,
  events: [
    {
      time: { type: String, required: true },
      type: {
        type: String,
        required: true
      },
      team: { type: String, required: true },
      player: { type: String, required: true },
      description: { type: String }
    }
  ],
  stats: {
    possession: {
      home: { type: Number, default: 50 },
      away: { type: Number, default: 50 }
    },
    shots: {
      home: { type: Number, default: 0 },
      away: { type: Number, default: 0 }
    },
    shots_on_target: {
      home: { type: Number, default: 0 },
      away: { type: Number, default: 0 }
    },
    fouls: {
      home: { type: Number, default: 0 },
      away: { type: Number, default: 0 }
    }
  }
});

const Live_Match = mongoose.model('Live_Match', live_matchSchema);
module.exports = Live_Match;