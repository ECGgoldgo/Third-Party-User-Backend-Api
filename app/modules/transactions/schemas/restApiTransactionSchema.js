var Sequelize = require("sequelize");
var db = require("../../../../config/db");
var txdx = db.connection.define(
  "rest_api_trnxs",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    req_type: {
      type: Sequelize.ENUM('APP', 'EXNG', 'META_MASK','CLOUD_WALLET'),
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    to_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    from_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    from_adrs: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    to_adrs: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    coin_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    coin_family: {
      type: Sequelize.TINYINT,
      allowNull: true,
    },
    tx_raw: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    nonce: {
      type: Sequelize.INTEGER,
      allowNull: true,
      validate: {},
    },
    gas_limit: {
      type: Sequelize.INTEGER,
      allowNull: true,
      validate: {},
    },
    gas_price: {
      type: Sequelize.DOUBLE,
      allowNull: true,
      validate: {},
    },
    gas_reverted: {
      type: Sequelize.DOUBLE,
      allowNull: true,
    },
    tx_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    amount: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      validate: {},
    },
    status: {
      type: Sequelize.ENUM("pending","complete","signed","failed","rejected","in-progress","approved","cancelled"),
      allowNull: true,
      validate: {},
    },
    trnx_type: {
      type: Sequelize.ENUM("WITHDRAW", "HOLDING", "REDEEM"),
      allowNull: true,
    },
    blockchain_status: {
      type: Sequelize.ENUM("NULL", "FAILED", "CONFIRMED"),
      allowNull: true,
    },
    thai_baht_token_price: {
      type: Sequelize.DOUBLE,
      allowNull: true,
    },
    trnx_fee: {
      type: Sequelize.DOUBLE,
      allowNull: true,
      validate: {},
    },
    fee: {
      type: Sequelize.DOUBLE,
      allowNull: true,
      validate: {},
    },
    block_id:{
      type: Sequelize.INTEGER,
      allowNull: true,
      validate: {},
    },
    block_hash:{
      type: Sequelize.CHAR,
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

module.exports = txdx;
