const mongoose = require('mongoose');

const user_scoreSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    totalPoints: {
        type: Number,
        required: true
    },
    predictions: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number,
        required: true
    },
    streak: {
        type: Number,
        required: true
    },
    badges: {
        type: [String],
        default: []
    }
});

const Player_user = mongoose.model('Player_user', user_scoreSchema);
module.exports = Player_user;