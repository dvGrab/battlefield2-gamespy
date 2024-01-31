"use strict";
//GPSP - Gamespy Partner Service Program
//GPCM - Gamespy Partner Content Management
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamespy_cm = void 0;
const net_1 = require("net");
const client_1 = require("./client");
class gamespy_cm {
    constructor() {
        this.clients = [];
        this.clients = [];
        this.server = (0, net_1.createServer)();
        this.server.on("connection", (socket) => {
            this.clients.push(new client_1.client(socket));
        });
        this.server.listen(29900, "127.0.0.1");
        this.server.on("listening", () => {
            console.log("Gamespy login listenting on 29900");
        });
    }
}
exports.gamespy_cm = gamespy_cm;
