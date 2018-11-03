"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    constructor(callback) {
        this.callback = callback;
    }
    log(...line) {
        this.callback(line.join(' '));
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map