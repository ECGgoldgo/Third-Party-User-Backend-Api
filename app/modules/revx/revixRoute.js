var express = require("express");
var passport = require('passport');
var router = express.Router();
var revxUsersController = require("./controllers/revxUsersController");
var revxRules = require("./rules/revx");

/** User Register */
router.post(
  "/login",
  revxRules.login,
  revxUsersController.login
);
router.get("/getContracts",passport.authenticate('jwt', { session: false }),revxUsersController.getContracts);
module.exports = router;
