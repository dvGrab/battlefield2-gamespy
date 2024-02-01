export function random(size: number) {
    let chars = "ABCDEFGHJKLMNOPQRSTUVWXYZ1234567890";

    let returnValue = "";

    for (var i = 0; i < size; i++) {
        returnValue += chars[Math.floor(Math.random() * chars.length)];
    }

    return returnValue;
}

export function randomhex(size: number) {
    let chars = "123456789abcdef";

    let returnValue = "";

    for (var i = 0; i < size; i++) {
        returnValue += chars[Math.floor(Math.random() * chars.length)];
    }

    return returnValue;
}

export function parse_param(data: string, paramater: string) {
    const regex = /\\(\w+)\\([^\\]+)/g

    let match;
    const matches = [];

    while ((match = regex.exec(data))) {
        matches.push({ parameter: match[1], value: match[2] });
    }

    let returnValue = "";

    matches.forEach((element) => {
        if (element.parameter == paramater)
            returnValue = element.value;
    });

    return returnValue;
}

export function crc16(data: string) {
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
};
