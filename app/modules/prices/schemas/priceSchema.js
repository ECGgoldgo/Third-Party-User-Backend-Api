var Sequelize = require("sequelize");
var db = require("../../../../config/db");
var goldPriceSettings = db.connection.define("gold_price_settings", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: true,
    validate: {},
  },
  full_price: {
    type: Sequelize.FLOAT,
    allowNull: true,
    validate: {},
  },
  gta_full_price: {
    type: Sequelize.FLOAT,
    allowNull: true,
    validate: {},
  },
  premium_price: {
    type: Sequelize.FLOAT,
    allowNull: true,
    validate: {},
  },
  actual_price: {
    type: Sequelize.FLOAT,
    allowNull: true,
    validate: {},
  },
  equivalent_token: {
    type: Sequelize.FLOAT,
    allowNull: true,
    validate: {},
  },
  override_price: {
    type: Sequelize.DOUBLE,
    allowNull: true,
    validate: {},
  },
  created_at: {
    type: Sequelize.DATE,
    allowNull: false,
    validate: {},
  },
  updated_at: {
    type: Sequelize.DATE,
    allowNull: false,
    validate: {},
  },
  gta_price_date_time: {
    type: Sequelize.DATE,
    allowNull: false,
    validate: {},
  },
});

module.exports = goldPriceSettings;
