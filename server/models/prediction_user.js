const mongoose = require('mongoose');

const prediction_userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    total_point: {
        type: Number,
        required: true
    },
    prediction: {
        type: String,
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

const Prediction_user = mongoose.model('Prediction_user', prediction_userSchema);
module.exports = Prediction_user;