var express = require("express");
var router = express.Router();
var priceController = require("./controllers/priceController");
let auth = require("../../../middlewares/auth");
/** User Register */
router.get("/detail", auth.checkAuth, priceController.detail);

module.exports = router;
