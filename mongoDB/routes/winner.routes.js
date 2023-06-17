const WinnerController = require('../controllers/winner.controller');

module.exports = app => {
    app.get('/api/winners', WinnerController.findAllWinners);
    app.get('/api/winner/:id', WinnerController.findOneWinner);
    app.get('/api/winners/userID/:user', WinnerController.findAllWinnersByUserID);
    app.get('/api/winner/axieID/:axieID', WinnerController.findOneWinnerByAxieID);
    app.put('/api/winners/:id', WinnerController.updateWinner);
    app.post('/api/winner', WinnerController.createWinner);
    app.delete('/api/winner/:id', WinnerController.deleteWinner);
}