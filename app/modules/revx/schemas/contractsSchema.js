var Sequelize = require("sequelize");
var db = require("../../../../config/db");

var contracts = db.connection.define("contracts", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {},
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {},
  },
  image_url: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {},
  },
  redirect_url: {
    type: Sequelize.TEXT,
    allowNull: true,
    validate: {},
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
    validate: {},
  },
  industry: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {},
  },
  status: {
    type: Sequelize.ENUM("0", "1"),
    allowNull: true,
    defaultValue: "1",
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

module.exports = contracts;
