const mongoose = require('mongoose');

const clubDetailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    upcoming_matches: {
        type: Number,
        required: true
    },
    active_players: {
        type: Number,
        required: true
    },
    win_rate: {
        type: Number,
        required: true
    }
});

const ClubDetail = mongoose.model('ClubDetail', clubDetailSchema);
module.exports = ClubDetail;