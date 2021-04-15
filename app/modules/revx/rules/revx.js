/** Validation error messages.*/
var errMsg = require("../../../../lang/errors").middleware;

var revxRules = {
  /**
   *  createWallet api hit here first for validate.
   *  Then will move to their method.
   */
  login: async (req, res, next) => {
    req.checkBody("name", "name_required").notEmpty();
    req.checkBody("email", "email_required").notEmpty();
    // req
    //   .checkBody("password", "password_required")
    //   .isLength({ min: 8, max: 100 });
    var validateErr = req.validationErrors();
    var errors = [];

    if (validateErr) {
      validateErr.forEach((element) => {
        var aliasErr = element.msg;
        switch (aliasErr) {
          case "name_required":
            errors.push({
              name: errMsg.name_required.name,
              message: errMsg.name_required.message,
            });
            break;
          case "email_required":
            errors.push({
              name: errMsg.email_required.name,
              message: errMsg.email_required.message,
            });
            break;
          // case "password_required":
          //   errors.push({
          //     name: errMsg.password_required.name,
          //     message: errMsg.password_required.message,
          //   });
          //   break;
        }
      });
    }
    if (errors.length) {
      return res.status(400).send({ status: false, errors: errors });
    } else {
      return next();
    }
  },
  
   
};
module.exports = revxRules;
