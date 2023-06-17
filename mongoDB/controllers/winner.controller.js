const Winner = require('../models/winner.model');

module.exports.findAllWinners = (req, res) => {
    Winner.find()
        .then((allWinners) => {
            res.json({ winners: allWinners })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}

module.exports.findAllWinnersByUserID = (req, res) => {
    Winner.find({user:req.params.user})
        .then((allWinners) => {
            res.json({ winners: allWinners })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}

module.exports.findOneWinner = (req, res) => {
    Winner.findOne({ _id: req.params.id })
        .then(oneWinner => {
            res.json({ winner: oneWinner })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
    }

module.exports.findOneWinnerByAxieID = (req, res) => {
    Winner.findOne({ axieID: req.params.axieID })
        .then(oneWinner => {
            res.json({ winner: oneWinner })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.createWinner = (req, res) => {
    Winner.create(req.body)
    .then(newWinner => {
            res.json({ winner: newWinner })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.updateWinner = (req, res) => {
    Winner.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
    )
        .then(updatedWinner => {
            res.json({ winner: updatedWinner })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.deleteWinner = (req, res) => {
    Winner.deleteOne({ _id: req.params.id })
        .then(result => {
            res.json({ result: result })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

