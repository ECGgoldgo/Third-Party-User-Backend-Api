var Sequelize = require("sequelize");
var db = require("../../../../config/db");

var revx_users = db.connection.define("revx_users", {
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

module.exports = revx_users;
