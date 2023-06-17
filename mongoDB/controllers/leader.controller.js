const Leader = require('../models/leader.model');

module.exports.findAllLeaders = (req, res) => {
    Leader.find()
        .then((allLeaders) => {
            res.json({ leaders: allLeaders })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}

module.exports.findOneLeader = (req, res) => {
    Leader.findOne({ _id: req.params.id })
        .then(oneLeader => {
            res.json({ leader: oneLeader })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.findOneLeaderByUserID = (req, res) => {
    console.log('here it is',req.params.userID)
    Leader.findOne({ userID: req.params.userID })
        .then(result => {
            res.json({ result: result })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}
        
module.exports.createLeader = (req, res) => {
    Leader.create(req.body)
    .then(newLeader => {
            res.json({ leader: newLeader })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.updateLeader = (req, res) => {
    console.log('req body',req.body)
    Leader.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
    )
        .then(updatedLeader => {
            res.json({ leader: updatedLeader })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.deleteLeader = (req, res) => {
    Leader.deleteOne({ _id: req.params.id })
        .then(result => {
            res.json({ result: result })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.deleteLeaderByUserID = (req, res) => {
    Leader.deleteOne({ user: req.params.userID })
        .then(result => {
            res.json({ result: result })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}
