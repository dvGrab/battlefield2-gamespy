//GPSP - Gamespy Partner Service Program
//GPCM - Gamespy Partner Content Management

import { Server, Socket, createServer } from "net";

export class gamespy_sp {

    server: Server;

    constructor() {
        this.server = createServer();

        this.server.on("connection", (socket) => {
            console.log("sp New client connected " + socket.remoteAddress + " on port " + socket.remotePort);

            socket.on("data", (data: Buffer) => {
                let output = data.toString();
                console.log("GPSP:" + output);
            });
        });

        this.server.listen(29901, "127.0.0.1");

        this.server.on("listening", () => {
            console.log("Gamespy login listenting on 29901");
        });
    }

}