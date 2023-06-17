const LeaderController = require('../controllers/leader.controller');

module.exports = app => {
    app.get('/api/leaders', LeaderController.findAllLeaders);
    app.get('/api/leader/:id', LeaderController.findOneLeader);
    app.get('/api/leader/userID/:userID', LeaderController.findOneLeaderByUserID);
    app.put('/api/leaders/:id', LeaderController.updateLeader);
    app.post('/api/leader', LeaderController.createLeader);
    app.delete('/api/leader/:id', LeaderController.deleteLeader);
    app.delete('/api/leader/userID/:userID', LeaderController.deleteLeaderByUserID);
    
}
