"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Document_1 = require("./Document");
var Window = /** @class */ (function () {
    function Window() {
        this.document = new Document_1.default();
    }
    return Window;
}());
exports.default = Window;
