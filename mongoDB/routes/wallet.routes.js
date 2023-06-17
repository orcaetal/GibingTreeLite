const WalletController = require('../controllers/wallet.controller');

module.exports = app => {
    app.get('/api/wallets', WalletController.findAllWallets);
    app.get('/api/wallet/:id', WalletController.findOneWallet);
    app.put('/api/wallets/:id', WalletController.updateWallet);
    app.post('/api/wallet', WalletController.createWallet);
    app.delete('/api/wallet/:id', WalletController.deleteWallet);
    app.delete('/api/wallet/userID/:userID', WalletController.deleteWalletByUserID);
    
}
