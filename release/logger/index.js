"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.logger_manager = exports.PREFIX = void 0;
const config_1 = require("../config");
const fs_extra_1 = require("fs-extra");
/* some prefix init lul */
var PREFIX;
(function (PREFIX) {
    PREFIX[PREFIX["NORMAL"] = 0] = "NORMAL";
    PREFIX[PREFIX["DEBUG"] = 1] = "DEBUG";
    PREFIX[PREFIX["ERROR"] = 2] = "ERROR";
    PREFIX[PREFIX["WARNING"] = 3] = "WARNING";
})(PREFIX || (exports.PREFIX = PREFIX = {}));
/* typical prefix class, you can read. */
class prefix {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }
}
/* what else should it be? */
class logger_manager {
    constructor() {
        this.prefixes = [];
    }
    register_prefix(id, name, color) {
        this.prefixes.push(new prefix(id, name, color));
    }
    find(id) {
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
    log(id, message) {
        let prefix = this.find(id);
        let date = new Date().toLocaleString("en-EN");
        /* some log log log wrapper :^) */
        console.log(`\x1b[${prefix.color}m[${prefix.name}] \x1b[97m${message}`);
        /* create log folder if it doesn't exist. preventing windows from throwing funny errors */
        (0, fs_extra_1.mkdirsSync)(`${config_1.config.logs}`);
        /* appending log file to it's needs */
        (0, fs_extra_1.appendFileSync)(`${config_1.config.logs}/${prefix.name}.log`, `[${prefix.name}][${date}] ${message}\n`);
    }
}
exports.logger_manager = logger_manager;
/* why do we init that shit here?  cuz badman *) */
exports.logger = new logger_manager();
exports.logger.register_prefix(PREFIX.NORMAL, "NORMAL", 92);
exports.logger.register_prefix(PREFIX.DEBUG, "DEBUG", 96);
exports.logger.register_prefix(PREFIX.ERROR, "ERROR", 91);
exports.logger.register_prefix(PREFIX.WARNING, "WARNING", 93);
