const mongoose = require("mongoose");

const old_matchSchema = new mongoose.Schema({
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
  time: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

const Old_match = mongoose.model('Old_match', old_matchSchema);
module.exports = Old_match; 