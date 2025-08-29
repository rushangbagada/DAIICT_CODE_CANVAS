const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  team1: {
    type: String,
    required: true
  },
  team2: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  team1_score: {
    type: Number,
    required: true
  },
  team2_score: {
    type: Number,
    required: true
  },
  mvp: {
    type: String,
    required: true
  }
});

const Match = mongoose.model("Match", matchSchema);
module.exports = Match; 