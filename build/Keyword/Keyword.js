"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Keyword {
    constructor(attributes) {
        if (!attributes.word) {
            throw new Error('no word in keyword');
        }
        this.word = attributes.word;
        if (!attributes.category) {
            throw new Error('no word in keyword');
        }
        this.category = attributes.category;
    }
}
exports.default = Keyword;
//# sourceMappingURL=Keyword.js.map