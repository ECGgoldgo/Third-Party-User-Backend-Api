var Sequelize = require('sequelize');
var db = require('../../../../config/db');
var Wallet = db.connection.define('country_codes', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
        }
    },
    phonecode: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
        }
    }
}, {
    hooks: {
        beforeValidate: function () {
        },
        afterValidate: function (user) {
        },
        afterCreate: function () {
        },
        beforeCreate: function () {
        },
    }
});

module.exports = Wallet;