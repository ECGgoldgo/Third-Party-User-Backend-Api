/** Validation error messages.*/
var errMsg = require("../../../../lang/errors").middleware;

var cloudConfigRules = {
  /**
   *  createWallet api hit here first for validate.
   *  Then will move to their method.
   */
  validateSaveConfig: async (req, res, next) => {
    // req.checkBody("exchange_id", "exchange_id_required").notEmpty();
    req.checkBody("cloud_config_name", "cloud_config_name_required").notEmpty();
    req.checkBody("service_key_name", "service_key_name_required").notEmpty();
    req.checkBody("target_address", "target_address_required").notEmpty();
    req.checkBody("azure_user_id", "azure_user_id_required").notEmpty();
    req.checkBody("azure_user_secret", "azure_user_secret_required").notEmpty();
    req.checkBody("subscription_id", "subscription_id_required").notEmpty();
    req.checkBody("tenant_id", "tenant_id_required").notEmpty();
    req.checkBody("vault_name", "vault_name_required").notEmpty();

    var validateErr = req.validationErrors();
    var errors = [];

    if (validateErr) {
      validateErr.forEach((element) => {
        var aliasErr = element.msg;
        switch (aliasErr) {
          case "exchange_id_required":
            errors.push({
              name: errMsg.exchange_id_required.name,
              message: errMsg.exchange_id_required.message,
            });
            break;
          case "cloud_config_name_required":
            errors.push({
              name: errMsg.cloud_config_name_required.name,
              message: errMsg.cloud_config_name_required.message,
            });
            break;
          case "service_key_name_required":
            errors.push({
              name: errMsg.service_key_name_required.name,
              message: errMsg.service_key_name_required.message,
            });
            break;
          case "target_address_required":
            errors.push({
              name: errMsg.target_address_required.name,
              message: errMsg.target_address_required.message,
            });
            break;
          case "azure_user_id_required":
            errors.push({
              name: errMsg.azure_user_id_required.name,
              message: errMsg.azure_user_id_required.message,
            });
            break;
          case "azure_user_secret_required":
            errors.push({
              name: errMsg.azure_user_secret_required.name,
              message: errMsg.azure_user_secret_required.message,
            });
            break;
          case "subscription_id_required":
            errors.push({
              name: errMsg.subscription_id_required.name,
              message: errMsg.subscription_id_required.message,
            });
            break;
          case "tenant_id_required":
            errors.push({
              name: errMsg.tenant_id_required.name,
              message: errMsg.tenant_id_required.message,
            });
            break;
          case "vault_name_required":
            errors.push({
              name: errMsg.vault_name_required.name,
              message: errMsg.vault_name_required.message,
            });
            break;
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
module.exports = cloudConfigRules;
