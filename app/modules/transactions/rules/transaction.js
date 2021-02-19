
/** Validation error messages.*/
var errMsg = require("../../../../lang/errors.json").middleware;

var transactionRules = {
    saveTransaction: async (req, res, next) => {
        req.checkBody("transactionHash", "transactionHash_required").notEmpty();
        // req
        //     .checkBody("to_address", "to_address_required")
        //     .notEmpty();
        req
            .checkBody("from_address", "from_address_required")
            .notEmpty();
        req
            .checkBody("block_id", "block_id_required")
            .notEmpty();
        req
            .checkBody("block_hash", "block_hash_required")
            .notEmpty();
        req
            .checkBody("amount", "amount_required")
            .notEmpty();
        var validateErr = req.validationErrors();
        var errors = [];

        if (validateErr) {
            validateErr.forEach((element) => {
            var aliasErr = element.msg;
            switch (aliasErr) {
                case "transactionHash_required":
                errors.push({
                    name: errMsg.transactionHash_required.name,
                    message: errMsg.transactionHash_required.message,
                });
                break;
                // case "to_address_required":
                // errors.push({
                //     name: errMsg.to_address_required.name,
                //     message: errMsg.to_address_required.message,
                // });
                // break;
                case "from_address_required":
                errors.push({
                    name: errMsg.from_address_required.name,
                    message: errMsg.from_address_required.message,
                });
                break;
                case "block_id_required":
                errors.push({
                    name: errMsg.block_id_required.name,
                    message: errMsg.block_id_required.message,
                });
                break;
                case "block_hash_required":
                errors.push({
                    name: errMsg.block_hash_required.name,
                    message: errMsg.block_hash_required.message,
                });
                break;
                case "amount_required":
                errors.push({
                    name: errMsg.amount_required.name,
                    message: errMsg.amount_required.message,
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
module.exports = transactionRules;
