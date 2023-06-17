const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    user: {
        type: String
    },
    address: {
        type: String
    }
});

const Wallet = mongoose.model('Wallet', WalletSchema);

module.exports = Wallet;
