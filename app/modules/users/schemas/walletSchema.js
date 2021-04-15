var Sequelize = require("sequelize");
var db = require("../../../../config/db");
var Wallet = db.connection.define(
  "wallets",
  {
    wallet_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {},
    },
    coin_id: {
      type: Sequelize.INTEGER,
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
  },
  {
    hooks: {
      beforeValidate: function() {},
      afterValidate: function(user) {},
      afterCreate: function() {},
      beforeCreate: function() {},
    },
  }
);

module.exports = Wallet;
