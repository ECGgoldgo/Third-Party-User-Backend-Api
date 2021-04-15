var express = require("express");
var passport = require('passport');
var router = express.Router();
var blockchainController = require("./controllers/blockchainController");
 
router.get("/getBlocks",passport.authenticate('jwt', { session: false }),blockchainController.getBlocks);
router.get("/getBlock/:blocknumber",passport.authenticate('jwt', { session: false }),blockchainController.getBlock);
router.get("/getTransactions",passport.authenticate('jwt', { session: false }),blockchainController.getTransactions);
router.get("/getTransaction/:hash",passport.authenticate('jwt', { session: false }),blockchainController.getTransaction);
router.get("/getLastChainActivity",passport.authenticate('jwt', { session: false }),blockchainController.getLastChainActivity);
router.get("/getLedgerStats/:since",passport.authenticate('jwt', { session: false }),blockchainController.getLedgerStats);
router.get("/getContracts",passport.authenticate('jwt', { session: false }),blockchainController.getContracts);
router.get("/getTransfersByTokens/:address",passport.authenticate('jwt', { session: false }),blockchainController.getTransfersByTokens);

module.exports = router;
