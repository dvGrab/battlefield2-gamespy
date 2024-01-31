"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crc16 = exports.parse_param = exports.randomhex = exports.random = void 0;
function random(size) {
    let chars = "ABCDEFGHJKLMNOPQRSTUVWXYZ1234567890";
    let returnValue = "";
    for (var i = 0; i < size; i++) {
        returnValue += chars[Math.floor(Math.random() * chars.length)];
    }
    return returnValue;
}
exports.random = random;
function randomhex(size) {
    let chars = "123456789abcdef";
    let returnValue = "";
    for (var i = 0; i < size; i++) {
        returnValue += chars[Math.floor(Math.random() * chars.length)];
    }
    return returnValue;
}
exports.randomhex = randomhex;
function parse_param(data, paramater) {
    const regex = /\\(\w+)\\([^\\]+)/g;
    const matches = [];
    let returnValue = "";
    let match;
    while ((match = regex.exec(data))) {
        matches.push({ parameter: match[1], value: match[2] });
    }
    matches.forEach((element) => {
        if (element.parameter == paramater)
            returnValue = element.value;
    });
    return returnValue;
}
exports.parse_param = parse_param;
function crc16(data) {
    var crc = 0xFFFF;
    var odd;
    var buffer = Buffer.from(data, "utf-8");
    for (var i = 0; i < buffer.length; i++) {
        crc = crc ^ buffer[i];
        for (var j = 0; j < 8; j++) {
            odd = crc & 0x0001;
            crc = crc >> 1;
            if (odd) {
                crc = crc ^ 0xA001;
            }
        }
    }
    return crc;
}
exports.crc16 = crc16;
;
