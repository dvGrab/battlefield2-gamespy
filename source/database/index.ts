import { PREFIX, logger } from "../logger";

import { DataTypes, Sequelize } from "sequelize";
import { User, initializeUserModel } from "./models/user";

export class database {

    connection: Sequelize;

    constructor() {
        this.connection = new Sequelize({
            storage: "./database.sqlite",
            dialect: "sqlite",
            logging: true
        });

        initializeUserModel(this.connection);

        this.connection.sync();

        this.connection.authenticate().then(() => {
            logger.log(PREFIX.NORMAL, "Database connection has been established.");
        });
    }

}