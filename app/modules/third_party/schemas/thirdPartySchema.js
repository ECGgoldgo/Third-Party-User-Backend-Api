var Sequelize = require("sequelize");
var db = require("../../../../config/db");

var Third_Party_Exchanges = db.connection.define("third_party_exchanges", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {},
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {},
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {},
  },
  verification_code: {
    type: Sequelize.TEXT,
    allowNull: false,
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

module.exports = Third_Party_Exchanges;
