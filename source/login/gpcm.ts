//GPSP - Gamespy Partner Service Program
//GPCM - Gamespy Partner Content Management

import { Server, Socket, createServer } from "net";
import { client } from "./client";
import { random } from "../utils";
import { config } from "../config";
import { PREFIX, logger } from "../logger";

export class gamespy_cm {

    clients: client[] = [];
    server: Server;

    constructor() {
        this.clients = [];

        this.server = createServer();

        this.server.on("connection", (socket) => {
            this.clients.push(new client(socket));

            socket.on("close", () => {
                let found = this.clients.findIndex(element => element.socket == socket);

                logger.log(PREFIX.NORMAL, `User ${this.clients[found].uniquenick} has been disconnected.`);

                this.clients.splice(found, 1);
            });
        });

        this.server.on("listening", () => {
            logger.log(PREFIX.WARNING, `GPCM login listenting on ${config.gpcm_port}.`)
        });

        this.server.listen(config.gpcm_port, config.gpcm_port);
    }

}