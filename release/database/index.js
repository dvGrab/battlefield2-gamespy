"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const logger_1 = require("../logger");
const sequelize_1 = require("sequelize");
const user_1 = require("./models/user");
const crypto_js_1 = require("crypto-js");
class database {
    constructor() {
        this.connection = new sequelize_1.Sequelize({
            storage: "./database.sqlite",
            dialect: "sqlite",
            logging: false
        });
        (0, user_1.initializeUserModel)(this.connection);
        this.connection.sync();
        this.connection.authenticate().then(() => {
            logger_1.logger.log(logger_1.PREFIX.NORMAL, "Database connection has been established.");
            let user = new user_1.User();

            user.name = "DevGrab";
            user.mail = "test@mail.com";
            user.password = (0, crypto_js_1.MD5)("123").toString();
            user.firstname = "John";
            user.lastname = "Doe";
            user.country = "US";
            user.save();
            
        });
    }
}
exports.database = database;
