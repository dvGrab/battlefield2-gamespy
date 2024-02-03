import { database } from "./database";
import { User } from "./database/models/user";
import { gamespy_cm } from "./login/gpcm";
import { MD5 } from "crypto-js";

let gpcm = new gamespy_cm();
let db = new database();

