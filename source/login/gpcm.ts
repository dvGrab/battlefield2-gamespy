//GPSP - Gamespy Partner Service Program
//GPCM - Gamespy Partner Content Management

import { Server, Socket, createServer } from "net";
import { client } from "./client";
import { random } from "../utils";

export class gamespy_cm {

    clients: client[] = [];
    server: Server;

    constructor() {
        this.clients = [];

        this.server = createServer();

        this.server.on("connection", (socket) => {
            this.clients.push(new client(socket));
        });

        this.server.listen(29900, "127.0.0.1");

        this.server.on("listening", () => {
            console.log("Gamespy login listenting on 29900.");
        });    
        

    }

}