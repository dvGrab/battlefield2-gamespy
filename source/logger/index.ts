import { appendFile } from "fs";
import { config } from "../config";
import { appendFileSync, mkdirsSync } from "fs-extra";


/* some prefix init lul */
export enum PREFIX {
    NORMAL,
    DEBUG,
    ERROR,
    WARNING
}

/* typical prefix class, you can read. */
class prefix {
    id: Number;
    name: String;
    color: Number;

    constructor(id: Number, name: String, color: Number) {
        this.id = id;
        this.name = name;
        this.color = color;
    }
}

/* what else should it be? */
export class logger_manager {

    prefixes: prefix[] = [];

    register_prefix(id: Number, name: String, color: Number) {
        this.prefixes.push(new prefix(id, name, color));
    }

    find(id: Number) {
        try {
            let result = this.prefixes.find(element => element.id == id);

            if (result == undefined)
                throw (`Error getting index of ${id} in this->prefixes.`);
            else
                return result;
        }
        catch (exception) {
            console.log(`EXCEPTION: ${exception}`);
        }
    }

    log(id: Number, message: string) {
        let prefix = this.find(id);

        let date = new Date().toLocaleString("en-EN");

        /* some log log log wrapper :^) */
        console.log(`\x1b[${prefix.color}m[${prefix.name}] \x1b[97m${message}`);

        /* create log folder if it doesn't exist. preventing windows from throwing funny errors */
        mkdirsSync(`${config.logs}`);

        /* appending log file to it's needs */
        appendFileSync(`${config.logs}/${prefix.name}.log`, `[${prefix.name}][${date}] ${message}\n`);
    }
}

/* why do we init that shit here?  cuz badman *) */
export var logger = new logger_manager();

logger.register_prefix(PREFIX.NORMAL, "NORMAL", 92);
logger.register_prefix(PREFIX.DEBUG, "DEBUG", 96);
logger.register_prefix(PREFIX.ERROR, "ERROR", 91);
logger.register_prefix(PREFIX.WARNING, "WARNING", 93);
