const mongoose = require('mongoose');

const club_playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true,
        enum: ["first year", "second year", "third year", "final year"]
    },
    position: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    matches: {
        type: Number,
        required: true
    },
    wins: {
        type: Number,
        required: true
    },
    losses: {
        type: Number,
        required: true
    },
    win_rate: {
        type: Number,
        required: true
    },
    club: {
        type: String,
        required: true
    }
});

const Club_player = mongoose.model('Club_player', club_playerSchema);
module.exports = Club_player;