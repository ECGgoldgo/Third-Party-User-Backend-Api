var Sequelize = require("sequelize");
var db = require("../../../../config/db");
const TBL_ROLE = require("./roleSchema");
const TBL_UserWalletRelation = require("./userWalletRelationSchema");
const TBL_COUNTRY_CODES = require("./countryCodeSchema");

var Users = db.connection.define("users", {
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {},
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {},
  },
  wallet_pin: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {},
  },
  wallet_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
    validate: {},
  },
  currency_fiat_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
    validate: {},
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {},
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {},
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {},
  },
  dob: {
    type: Sequelize.DATE,
    allowNull: true,
    validate: {},
  },
  address: {
    type: Sequelize.TEXT,
    allowNull: true,
    validate: {},
  },
  city: {
    type: Sequelize.TEXT,
    allowNull: true,
    validate: {},
  },
  country: {
    type: Sequelize.TEXT,
    allowNull: true,
    validate: {},
  },
  // nationality: {
  //   type: Sequelize.STRING,
  //   allowNull: true,
  //   validate: {},
  // },
  zip_code: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {},
  },
  document_number: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {},
  },
  doc_image1: {
    type: Sequelize.TEXT,
    allowNull: true,
    validate: {},
  },
  doc_image2: {
    type: Sequelize.TEXT,
    allowNull: true,
    validate: {},
  },
  mobile: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {},
  },
  country_code_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
    validate: {},
  },
  device_token: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {},
  },
  device_type: {
    type: Sequelize.TINYINT,
    allowNull: true,
    validate: {},
  },
  role: {
    type: Sequelize.TINYINT,
    allowNull: false,
    validate: {},
  },
  is_production: {
    type: Sequelize.TINYINT,
    allowNull: true,
    validate: {},
  },
  kyc_id: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {},
  },
  kyc_status: {
    type: Sequelize.ENUM("0", "1"),
    allowNull: true,
    validate: {},
  },
  email_status: {
    type: Sequelize.ENUM("0", "1"),
    allowNull: true,
    validate: {},
  },
  mobile_status: {
    type: Sequelize.ENUM("0", "1"),
    allowNull: true,
    validate: {},
  },
  status: {
    type: Sequelize.ENUM("0", "1"),
    allowNull: true,
    validate: {},
  },
  isSuspend: {
    type: Sequelize.ENUM("1", "2"),
    allowNull: true,
    validate: {},
  },
  login_pass_check_count: {
    type: Sequelize.TINYINT,
    allowNull: true,
    validate: {},
  },
  login_pass_check_datetime: {
    type: Sequelize.DATE,
    allowNull: true,
    validate: {},
  },
  is_login: {
    type: Sequelize.ENUM("0", "1"),
    allowNull: true,
    validate: {},
  },
  reset_password_link_status: {
    type: Sequelize.ENUM("0", "1"),
    allowNull: true,
    validate: {},
  },
  kyc_rejection_comment: {
    type: Sequelize.TEXT,
    allowNull: true,
    validate: {},
  },
  kyc_resubmit: {
    type: Sequelize.ENUM("0", "1"),
    allowNull: true,
    defaultValue: "0",
    validate: {},
  },
  kyc_resubmit_date: {
    type: Sequelize.DATE,
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
Users.belongsTo(TBL_ROLE, { foreignKey: "role", as: "roleData" });
Users.belongsTo(TBL_UserWalletRelation, {
  foreignKey: "wallet_id",
  as: "wallet_relation",
});
Users.belongsTo(TBL_COUNTRY_CODES, {
  foreignKey: "country_code_id",
  as: "country_code_data",
});

module.exports = Users;
