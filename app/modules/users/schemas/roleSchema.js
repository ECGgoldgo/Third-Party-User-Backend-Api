var Sequelize = require("sequelize");
var db = require("../../../../config/db");
var Roles = db.connection.define("roles", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {}
  },
  created_at: {
    type: Sequelize.DATE,
    allowNull: false,
    validate: {}
  }
});

module.exports = Roles;
