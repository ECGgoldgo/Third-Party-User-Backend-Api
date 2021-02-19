var Sequelize = require("sequelize");
var db = require("../../config/db");
const Op = Sequelize.Op;

var tblConstants = require("../../config/tbl_constants");
const TBL_GOLD_PRICE_SETTING = require("../modules/prices/schemas/priceSchema");
require("../../globalfunctions");
module.exports = {
 /**
   * Get user id from address
   */
  getUserIdByAddress: async (address) => {
    var query = `SELECT u.user_id FROM ${tblConstants.WALLETS} AS w INNER JOIN ${tblConstants.USERS} AS u ON w.wallet_id = u.wallet_id WHERE w.address LIKE '${address}'`;
    console.log(" getUserDeviceToken: ", query);
    var userData = await db.connection.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });
    console.log("userData: ", userData);
    let userId=0;
    if (userData.length > 0) {
      userId=userData[0].user_id;
    }
    return userId;
  },
  /**
   * Get to user id from address
   */
  getToUserIdByAddress: async (address) => {
    var query = `SELECT cuw.user_id FROM ${tblConstants.CLOUD_USER_WALLETS} AS cuw INNER JOIN ${tblConstants.THIRD_PARTY_EXCHANGES} AS tpe ON tpe.id = cuw.user_id WHERE cuw.address LIKE '${address}'`;
    console.log("get to user address: ", query);
    var userData = await db.connection.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });
    console.log("userData: ", userData);
    let userId=0;
    if (userData.length > 0) {
      userId=userData[0].user_id;
    }
    return userId;
  },
  getDailyGoldPrice: async () => {
    var checkGoldPrice = await TBL_GOLD_PRICE_SETTING.findOne({
      attributes: ["actual_price", "premium_price", "full_price"],
    });
    var exactPrice = 0;
    var full_price = 0;
    if (checkGoldPrice != null) {
      if (checkGoldPrice["premium_price"] != null) {
        exactFullPrice = await bigNumberSafeMath(
          checkGoldPrice["full_price"],
          "+",
          checkGoldPrice["premium_price"]
        );
        exactPrice = await bigNumberSafeMath(exactFullPrice, "/", 15.244);
      } else {
        exactPrice = checkGoldPrice["actual_price"];
      }
      full_price = checkGoldPrice["full_price"];
    }
    let dbRes = {
      daily_gold_price: exactPrice,
      full_price: full_price,
    };

    return dbRes;
  }
}