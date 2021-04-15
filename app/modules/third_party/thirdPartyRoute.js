var express = require("express");
var router = express.Router();
var thirdPartyRules = require("./rules/third_party");
var thirdPartyController = require("./controllers/thirdPartyController");
let auth = require("../../../middlewares/auth");

/** User Register */
router.post(
  "/register_login",
  thirdPartyRules.validateRegister,
  thirdPartyController.registerLogin
);


router.get("/balance/:address", auth.checkAuth, thirdPartyController.balance);
router.post("/saveWallet",auth.checkAuth,thirdPartyRules.saveWallet,thirdPartyController.saveWallet);
router.get("/changeWallet/:id", auth.checkAuth, thirdPartyController.changeWallet);

router.get("/walletList",auth.checkAuth,thirdPartyController.walletList);
router.get("/defaultAddress",auth.checkAuth,thirdPartyController.getDefaultWallet);

module.exports = router;
