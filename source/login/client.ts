import { Socket } from "net";
import { crc16, parse_param, random, randomhex } from "../utils";
import { MD5 } from "crypto-js";
import { PREFIX, logger } from "../logger";
import { prependListener } from "process";

export class client {
    socket: Socket;

    key: string;
    sessionkey: string;

    id: string;
    port: string;
    response: string;
    gamename: string;
    productid: string;
    challenge: string;
    uniquenick: string;
    namespaceid: string;
    sdkrevision: string;

    logged_in: boolean = false;
    profile: boolean = false;

    constructor(socket: Socket) {
        this.socket = socket;

        this.send_challenge();

        this.socket.on("data", (data: Buffer) => {

            if (!this.logged_in)
                this.parse_client(data.toString());

            if (!this.profile)
                this.parse_profile(data.toString());

            this.parse_logout(data.toString());
        });

        this.socket.on("close", () => {

        });

        this.socket.on("error", (error) => {
            logger.log(PREFIX.DEBUG, `User ${this.uniquenick ? this.uniquenick : "Unknown"} has been disconnected. (${error}).`);
        });
    }

    send_challenge() {
        this.key = random(10);
        this.socket.write(`\\lc\\1\\challenge\\${this.key}\\id\\1\\final\\`)
    }

    send_profile() {
        this.socket.write(`\\pi\\profileid\\${this.id}\\nick\\${this.uniquenick}\\userid\\${this.id}\\email\\${this.uniquenick}\\sig\\${randomhex(32)}\\uniquenick\\${this.uniquenick}\\pid\\${this.id}\\firstname\\firstname\\lastname\\lastname\\homepage\\\\zipcode\\00000\\countrycode\\US\\st\\  \\birthday\\0\\sex\\0\\icquin\\0\\aim\\\\pic\\0\\pmask\\64\\occ\\0\\ind\\0\\inc\\0\\mar\\0\\chc\\0\\i1\\0\\o1\\0\\mp\\4\\lon\\0.000000\\lat\\0.000000\\loc\\\\conn\\1\\id\\2\\final\\`);
        this.profile = true;
    }

    send_login() {
        if (this.proof(this.challenge, this.key) != this.response)
            return this.send_error("Invalid password.");

        logger.log(PREFIX.NORMAL, `User ${this.uniquenick} has been logged in successfully.`);

        this.socket.write(`\\lc\\2\\sesskey\\${this.sessionkey}\\proof\\${this.proof(this.key, this.challenge)}\\userid\\${this.id}\\profileid\\${this.id}\\uniquenick\\${this.uniquenick}\\lt\\${random(22)}__\\id\\1\\final\\`);
        this.logged_in = true;
    }

    send_error(message: string) {
        this.socket.write(`\\error\\err\\0\\fatal\\errmsg\\${message}\\id\\1\\final\\`);
        logger.log(PREFIX.ERROR, "User " + this.uniquenick + " received error. (" + message + ")");
    }

    parse_logout(message: string) {

        let logout = message.includes("logout");
        let sesskey = parse_param(message, "sesskey");

        if(sesskey && logout){
            this.logged_in = false;
            this.profile = false;
        }

    }

    parse_client(message: string) {

        let uniquenick = parse_param(message, "uniquenick");
        let challenge = parse_param(message, "challenge");
        let response = parse_param(message, "response");

        if (uniquenick || challenge || response) {
            this.response = response;
            this.uniquenick = uniquenick;
            this.challenge = challenge;

            this.id = crc16("1").toString(); //add database id (needed later)
            this.port = parse_param(message, "port");
            this.gamename = parse_param(message, "gamename");
            this.namespaceid = parse_param(message, "namespaceid");
            this.sdkrevision = parse_param(message, "sdkrevision");
            this.productid = parse_param(message, "product_id");

            this.sessionkey = crc16(this.uniquenick).toString();

            this.send_login();
        }

    }

    parse_profile(message: string) {
        let profileid = parse_param(message, "profileid");
        let sesskey = parse_param(message, "sesskey");

        if (profileid || sesskey) {
            this.send_profile();
        }
    }

    proof(challenge_server: string, challenge_client: string) {

        let password = MD5("123").toString().toLowerCase(); //check for database password md5

        let returnValue = "";
        returnValue += password;
        returnValue += "                                                ";
        returnValue += this.uniquenick;
        returnValue += challenge_server;
        returnValue += challenge_client;
        returnValue += password;

        return MD5(returnValue).toString();
    }

}

