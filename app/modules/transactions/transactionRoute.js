var express = require("express");
var router = express.Router();
var transactionController = require("./controllers/transactionController");
var transactionRules = require("./rules/transaction");
let auth = require("../../../middlewares/auth");
/** User Register */
router.post("/list", auth.checkAuth, transactionController.transactions);
router.post(
    "/saveTransaction",
    auth.checkAuth,
    transactionRules.saveTransaction,
    transactionController.save
);
router.get("/getList",auth.checkAuth,transactionController.list);
router.get("/getData/:address",auth.checkAuth,transactionController.getData);
module.exports = router;
