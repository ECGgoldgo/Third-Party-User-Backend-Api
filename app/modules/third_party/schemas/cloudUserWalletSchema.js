
var Sequelize = require("sequelize");
var db = require("../../../../config/db");

var cloudUserWallets = db.connection.define("cloud_user_wallets", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {},
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {},
  },
  address: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {},
  },
  status: {
    type: Sequelize.ENUM("0", "1"),
    allowNull: true,
    defaultValue: "0",
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
});

module.exports = cloudUserWallets;
