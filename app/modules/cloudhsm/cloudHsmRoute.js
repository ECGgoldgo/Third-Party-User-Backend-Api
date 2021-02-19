var express = require("express");
var router = express.Router();
var cloudHsmController = require("./controllers/cloudhsmController");
let auth = require("../../../middlewares/auth");
let cloudHsmRule = require("./rules/cloudHsm");
/** User Register */
router.post(
  "/saveConfig",
  auth.checkAuth,
  cloudHsmRule.validateSaveConfig,
  cloudHsmController.saveConfig
);

module.exports = router;
