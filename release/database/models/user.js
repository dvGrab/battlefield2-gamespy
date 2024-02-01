"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeUserModel = exports.User = void 0;
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
}
exports.User = User;
function initializeUserModel(sequelize) {
    User.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        mail: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        firstname: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize
    });
}
exports.initializeUserModel = initializeUserModel;
