var Sequelize = require("sequelize");
var db = require("../../../../config/db");
var cloudHsmConfigs = db.connection.define("cloud_hsm_configs", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  exchange_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {},
  },
  cloud_config_name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {},
  },
  service_key_name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {},
  },
  target_address: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {},
  },
  azure_user_id: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {},
  },
  azure_user_secret: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {},
  },
  subscription_id: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {},
  },
  tenant_id: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {},
  },
  vault_name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {},
  },
  public_address: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {},
  },
  cloudhsm_id: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {},
  },
  service_id: {
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

module.exports = cloudHsmConfigs;
