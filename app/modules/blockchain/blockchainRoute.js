var express = require("express");
var router = express.Router();
var blockchainController = require("./controllers/blockchainController");
let auth = require("../../../middlewares/auth");
router.get("/getBlocks",auth.checkAuth,blockchainController.getBlocks);
router.get("/getBlock/:blocknumber",auth.checkAuth,blockchainController.getBlock);
router.get("/getTransactions",auth.checkAuth,blockchainController.getTransactions);
router.get("/getTransaction/:hash",auth.checkAuth,blockchainController.getTransaction);
router.get("/getLastChainActivity",auth.checkAuth,blockchainController.getLastChainActivity);
router.get("/getLedgerStats/:since",auth.checkAuth,blockchainController.getLedgerStats);
router.get("/getContracts",auth.checkAuth,blockchainController.getContracts);
router.get("/getTransfersByTokens/:address",auth.checkAuth,blockchainController.getTransfersByTokens);

module.exports = router;
