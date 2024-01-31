"use strict";
//GPSP - Gamespy Partner Service Program
//GPCM - Gamespy Partner Content Management
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamespy_sp = void 0;
const net_1 = require("net");
class gamespy_sp {
    constructor() {
        this.server = (0, net_1.createServer)();
        this.server.on("connection", (socket) => {
            console.log("sp New client connected " + socket.remoteAddress + " on port " + socket.remotePort);
            socket.on("data", (data) => {
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
exports.gamespy_sp = gamespy_sp;
