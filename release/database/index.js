"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const logger_1 = require("../logger");
const sequelize_1 = require("sequelize");
const user_1 = require("./models/user");
class database {
    constructor() {
        this.connection = new sequelize_1.Sequelize({
            storage: "./database.sqlite",
            dialect: "sqlite",
            logging: true
        });
        (0, user_1.initializeUserModel)(this.connection);
        this.connection.sync();
        this.connection.authenticate().then(() => {
            logger_1.logger.log(logger_1.PREFIX.NORMAL, "Database connection has been established.");
        });
    }
}
exports.database = database;
