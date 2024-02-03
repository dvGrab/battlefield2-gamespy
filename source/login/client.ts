import { Socket } from "net";
import { crc16, parse_param, random, randomhex } from "../additions/utils";
import { MD5 } from "crypto-js";
import { PREFIX, logger } from "../logger";
import { User } from "../database/models/user";
import { database } from "../database";

export class client {

    user: User;
    socket: Socket;

    key: string;
    sessionkey: string;

    port: string;
    response: string;
    gamename: string;
    productid: string;
    challenge: string;
    namespaceid: string;
    sdkrevision: string;

    logged_in: boolean = false;
    profile: boolean = false;

    constructor(socket: Socket) {
        this.socket = socket;

        this.user = new User();

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
            logger.log(PREFIX.DEBUG, `User ${this.user.name ? this.user.name : "Unknown"} has been disconnected. (${error}).`);
        });
    }

    send_challenge() {
        this.key = random(10);
        this.socket.write(`\\lc\\1\\challenge\\${this.key}\\id\\1\\final\\`)
    }

    send_profile() {
        this.socket.write(`\\pi\\profileid\\${this.user.id}\\nick\\${this.user.name}\\userid\\${this.user.id}\\email\\${this.user.name}\\sig\\${randomhex(32)}\\uniquenick\\${this.user.name}\\pid\\${this.user.name}\\firstname\\firstname\\lastname\\lastname\\homepage\\\\zipcode\\00000\\countrycode\\US\\st\\  \\birthday\\0\\sex\\0\\icquin\\0\\aim\\\\pic\\0\\pmask\\64\\occ\\0\\ind\\0\\inc\\0\\mar\\0\\chc\\0\\i1\\0\\o1\\0\\mp\\4\\lon\\0.000000\\lat\\0.000000\\loc\\\\conn\\1\\id\\2\\final\\`);
        this.profile = true;
    }

    send_login() {
        if (this.proof(this.challenge, this.key) != this.response)
            return this.send_error("Invalid passwordwwww.");

        logger.log(PREFIX.NORMAL, `User ${this.user.name} has been logged in successfully.`);

        this.socket.write(`\\lc\\2\\sesskey\\${this.sessionkey}\\proof\\${this.proof(this.key, this.challenge)}\\userid\\${this.user.id}\\profileid\\${this.user.id}\\uniquenick\\${this.user.name}\\lt\\${random(22)}__\\id\\1\\final\\`);
        this.logged_in = true;
    }

    send_error(message: string) {
        this.socket.write(`\\error\\err\\0\\fatal\\errmsg\\${message}\\id\\1\\final\\`);
        logger.log(PREFIX.ERROR, "User " + this.user.name + " received error. (" + message + ")");
    }

    parse_logout(message: string) {

        let logout = message.includes("logout");
        let sesskey = parse_param(message, "sesskey");

        if (sesskey && logout) {
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
            this.challenge = challenge;
            this.user.name = uniquenick; //set temporary username because of error logging would cause (undefined).
            this.port = parse_param(message, "port");
            this.gamename = parse_param(message, "gamename");
            this.namespaceid = parse_param(message, "namespaceid");
            this.sdkrevision = parse_param(message, "sdkrevision");
            this.productid = parse_param(message, "product_id");

            this.sessionkey = crc16(uniquenick).toString();

            User.findOne({ where: { name: uniquenick } }).then((element) => {
                if (element) {
                    this.user = element;
                    this.send_login();
                }
                else {
                    this.send_error("User is not available.");
                    this.logged_in = false;
                    this.profile = false;
                }
            });
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

        let password = this.user.password;

        let returnValue = "";
        returnValue += password;
        returnValue += "                                                ";
        returnValue += this.user.name;
        returnValue += challenge_server;
        returnValue += challenge_client;
        returnValue += password;

        return MD5(returnValue).toString();
    }

}

