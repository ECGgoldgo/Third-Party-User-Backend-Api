var express = require("express");
var passport = require('passport');
var router = express.Router();
var usersController = require("./controllers/UsersController");
 
router.get(
    "/list",
    passport.authenticate('jwt', { session: false }),
    usersController.list
);
 

module.exports = router;
