var Sequelize = require("sequelize");
var db = require("../../../../config/db");
var userWallet = require("./walletSchema");
var userWalletRelation = db.connection.define("user_wallet_relation", {
  wallet_rel_id: {
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
  wallet_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {},
  },
  balance: {
    type: Sequelize.DOUBLE,
    allowNull: true,
    validate: {},
  },
  balance_blocked: {
    type: Sequelize.DOUBLE,
    allowNull: true,
    validate: {},
  },
  user_withdraw_limit: {
    type: Sequelize.DOUBLE,
    allowNull: true,
    validate: {},
  },
  status: {
    type: Sequelize.TINYINT,
    allowNull: true,
    validate: {},
  },
  sort_order: {
    type: Sequelize.INTEGER,
    allowNull: true,
    validate: {},
  },
  on_demand_collect_in_queue: {
    type: Sequelize.TINYINT,
    allowNull: true,
    validate: {},
  },
  daily_collect_in_queue: {
    type: Sequelize.TINYINT,
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
});
userWalletRelation.belongsTo(userWallet, {
  foreignKey: "wallet_id",
  as: "walletData",
});

module.exports = userWalletRelation;
