/** Database table schemas. */
var sequelize = require("sequelize");
var db = require("../../../../config/db");
var config = require("../../../../config/config");

const tblPrice = require("../schemas/priceSchema");

const Op = sequelize.Op;

module.exports = {
  /**
   * Register
   * */
  detail: async (req, res, next) => {
    try {
      var priceData = await tblPrice.findOne({
        attributes: ["full_price", "premium_price"],
      });

      if (!priceData) {
        return res.status(400).send({
          status: false,
          message: "Data doesn't found.",
        });
      }

      let data = {
        gta_gold_price: priceData.full_price,
        marketplace_price: priceData.full_price + priceData.premium_price,
      };
      return res.status(200).send({
        status: true,
        data: data,
        message: "Price detail get successfully.",
      });
      // });
    } catch (error) {
      return res
        .status(200)
        .send({ status: false, data: `${error}`, message: error.message });
    }
  },
};
