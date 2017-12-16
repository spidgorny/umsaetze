"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CollectionArray_1 = require("./CollectionArray");
const Keyword_1 = require("./Keyword");
class KeywordCollection extends CollectionArray_1.default {
    constructor(...arguments2) {
        super(...arguments2);
        this.modelClass = Keyword_1.default;
        this.fetch();
    }
}
exports.default = KeywordCollection;
//# sourceMappingURL=KeywordCollection.js.map