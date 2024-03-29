"use strict";
//GPSP - Gamespy Partner Service Program
//GPCM - Gamespy Partner Content Management
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamespy_cm = void 0;
const net_1 = require("net");
const client_1 = require("./client");
const config_1 = require("../config");
const logger_1 = require("../logger");
class gamespy_cm {
    constructor() {
        this.clients = [];
        this.clients = [];
        this.server = (0, net_1.createServer)();
        this.server.on("connection", (socket) => {
            this.clients.push(new client_1.client(socket));
            socket.on("close", () => {
                let found = this.clients.findIndex(element => element.socket == socket);
                //logger.log(PREFIX.NORMAL, `User ${this.clients[found].uniquenick} has been disconnected.`);
                this.clients.splice(found, 1);
            });
        });
        this.server.on("listening", () => {
            logger_1.logger.log(logger_1.PREFIX.WARNING, `GPCM login listenting on ${config_1.config.gpcm_port}.`);
        });
        this.server.listen(config_1.config.gpcm_port, config_1.config.gpcm_port);
    }
}
exports.gamespy_cm = gamespy_cm;
