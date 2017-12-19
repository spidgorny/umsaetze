"use strict";
var Keyword = (function () {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Keyword;
