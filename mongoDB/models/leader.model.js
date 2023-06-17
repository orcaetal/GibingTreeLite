const mongoose = require('mongoose');

const LeaderSchema = new mongoose.Schema({
    userID: {
        type: String
    },
    username: {
        type: String
    },
    wins: {
        type: String
    }
});

const Leader = mongoose.model('Leader', LeaderSchema);

module.exports = Leader;
