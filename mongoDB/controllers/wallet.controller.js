const Wallet = require('../models/wallet.model');

module.exports.findAllWallets = (req, res) => {
    Wallet.find()
        .then((allWallets) => {
            res.json({ wallets: allWallets })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}

module.exports.findOneWallet = (req, res) => {
    Wallet.findOne({ _id: req.params.id })
        .then(oneWallet => {
            res.json({ wallet: oneWallet })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.createWallet = (req, res) => {
    Wallet.create(req.body)
    .then(newWallet => {
            res.json({ wallet: newWallet })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.updateWallet = (req, res) => {
    Wallet.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
    )
        .then(updatedWallet => {
            res.json({ wallet: updatedWallet })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.deleteWallet = (req, res) => {
    Wallet.deleteOne({ _id: req.params.id })
        .then(result => {
            res.json({ result: result })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.deleteWalletByUserID = (req, res) => {
    Wallet.deleteOne({ user: req.params.userID })
        .then(result => {
            res.json({ result: result })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}
