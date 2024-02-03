import { PREFIX, logger } from "../logger";

import { DataTypes, Sequelize } from "sequelize";
import { User, initializeUserModel } from "./models/user";
import { MD5 } from "crypto-js";

export class database {

    connection: Sequelize;

    constructor() {
        this.connection = new Sequelize({
            storage: "./database.sqlite",
            dialect: "sqlite",
            logging: false
        });

        initializeUserModel(this.connection);

        this.connection.sync();

        this.connection.authenticate().then(() => {
            logger.log(PREFIX.NORMAL, "Database connection has been established.");

            /* Temporary user creation */
            let user = new User();

            user.name = "DevGrab";
            user.mail = "test@gmail.com";
            user.password = MD5("123").toString();
            user.firstname = "John";
            user.lastname = "Doe";
            user.country = "US";

            user.save();
        });
    }

}