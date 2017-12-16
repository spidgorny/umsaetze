"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Document = /** @class */ (function () {
    function Document() {
    }
    Document.prototype.createElement = function (tag) {
        var el = new HTMLElement();
        el.tagName = tag;
        return el;
    };
    return Document;
}());
exports.default = Document;
