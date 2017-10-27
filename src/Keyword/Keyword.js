"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Keyword = /** @class */ (function () {
    function Keyword(attributes) {
        if (!attributes.word) {
            throw new Error('no word in keyword');
        }
        this.word = attributes.word;
        if (!attributes.category) {
            throw new Error('no word in keyword');
        }
        this.category = attributes.category;
    }
    return Keyword;
}());
exports.default = Keyword;
