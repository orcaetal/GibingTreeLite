const mongoose = require('mongoose');

const WinnerSchema = new mongoose.Schema({
    user: {
        type: String
    },
    axieID: {
        type: String
    }
});

const Winner = mongoose.model('Winner', WinnerSchema);

module.exports = Winner;
