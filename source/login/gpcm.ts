//GPSP - Gamespy Partner Service Program
//GPCM - Gamespy Partner Content Management

import { Server, Socket, createServer } from "net";
import { client } from "./client";
import { random } from "../utils";
import { config } from "../config";

export class gamespy_cm {

    clients: client[] = [];
    server: Server;

    constructor() {
        this.clients = [];

        this.server = createServer();

        this.server.on("connection", (socket) => {
            this.clients.push(new client(socket));
        });

        this.server.on("listening", () => {
            console.log(`GPCM login listenting on ${config.gpcm_port}.`);
        });

        this.server.listen(config.gpcm_port, config.gpcm_port);
    }

}