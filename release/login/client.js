"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const utils_1 = require("../additions/utils");
const crypto_js_1 = require("crypto-js");
const logger_1 = require("../logger");
class client {
    constructor(socket) {
        this.logged_in = false;
        this.profile = false;
        this.socket = socket;
        this.send_challenge();
        this.socket.on("data", (data) => {
            if (!this.logged_in)
                this.parse_client(data.toString());
            if (!this.profile)
                this.parse_profile(data.toString());
            this.parse_logout(data.toString());
        });
        this.socket.on("close", () => {
        });
        this.socket.on("error", (error) => {
            logger_1.logger.log(logger_1.PREFIX.DEBUG, `User ${this.uniquenick ? this.uniquenick : "Unknown"} has been disconnected. (${error}).`);
        });
    }
    send_challenge() {
        this.key = (0, utils_1.random)(10);
        this.socket.write(`\\lc\\1\\challenge\\${this.key}\\id\\1\\final\\`);
    }
    send_profile() {
        this.socket.write(`\\pi\\profileid\\${this.id}\\nick\\${this.uniquenick}\\userid\\${this.id}\\email\\${this.uniquenick}\\sig\\${(0, utils_1.randomhex)(32)}\\uniquenick\\${this.uniquenick}\\pid\\${this.id}\\firstname\\firstname\\lastname\\lastname\\homepage\\\\zipcode\\00000\\countrycode\\US\\st\\  \\birthday\\0\\sex\\0\\icquin\\0\\aim\\\\pic\\0\\pmask\\64\\occ\\0\\ind\\0\\inc\\0\\mar\\0\\chc\\0\\i1\\0\\o1\\0\\mp\\4\\lon\\0.000000\\lat\\0.000000\\loc\\\\conn\\1\\id\\2\\final\\`);
        this.profile = true;
    }
    send_login() {
        if (this.proof(this.challenge, this.key) != this.response)
            return this.send_error("Invalid password.");
        logger_1.logger.log(logger_1.PREFIX.NORMAL, `User ${this.uniquenick} has been logged in successfully.`);
        this.socket.write(`\\lc\\2\\sesskey\\${this.sessionkey}\\proof\\${this.proof(this.key, this.challenge)}\\userid\\${this.id}\\profileid\\${this.id}\\uniquenick\\${this.uniquenick}\\lt\\${(0, utils_1.random)(22)}__\\id\\1\\final\\`);
        this.logged_in = true;
    }
    send_error(message) {
        this.socket.write(`\\error\\err\\0\\fatal\\errmsg\\${message}\\id\\1\\final\\`);
        logger_1.logger.log(logger_1.PREFIX.ERROR, "User " + this.uniquenick + " received error. (" + message + ")");
    }
    parse_logout(message) {
        let logout = message.includes("logout");
        let sesskey = (0, utils_1.parse_param)(message, "sesskey");
        if (sesskey && logout) {
            this.logged_in = false;
            this.profile = false;
        }
    }
    parse_client(message) {
        let uniquenick = (0, utils_1.parse_param)(message, "uniquenick");
        let challenge = (0, utils_1.parse_param)(message, "challenge");
        let response = (0, utils_1.parse_param)(message, "response");
        if (uniquenick || challenge || response) {
            this.response = response;
            this.uniquenick = uniquenick;
            this.challenge = challenge;
            this.id = (0, utils_1.crc16)("1").toString(); //add database id (needed later)
            this.port = (0, utils_1.parse_param)(message, "port");
            this.gamename = (0, utils_1.parse_param)(message, "gamename");
            this.namespaceid = (0, utils_1.parse_param)(message, "namespaceid");
            this.sdkrevision = (0, utils_1.parse_param)(message, "sdkrevision");
            this.productid = (0, utils_1.parse_param)(message, "product_id");
            this.sessionkey = (0, utils_1.crc16)(this.uniquenick).toString();
            this.send_login();
        }
    }
    parse_profile(message) {
        let profileid = (0, utils_1.parse_param)(message, "profileid");
        let sesskey = (0, utils_1.parse_param)(message, "sesskey");
        if (profileid || sesskey) {
            this.send_profile();
        }
    }
    proof(challenge_server, challenge_client) {
        let password = (0, crypto_js_1.MD5)("123").toString().toLowerCase(); //check for database password md5
        let returnValue = "";
        returnValue += password;
        returnValue += "                                                ";
        returnValue += this.uniquenick;
        returnValue += challenge_server;
        returnValue += challenge_client;
        returnValue += password;
        return (0, crypto_js_1.MD5)(returnValue).toString();
    }
}
exports.client = client;
