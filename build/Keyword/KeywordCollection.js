"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CollectionArray_1 = __importDefault(require("../Util/CollectionArray"));
const Keyword_1 = __importDefault(require("./Keyword"));
class KeywordCollection extends CollectionArray_1.default {
    constructor(...arguments2) {
        super(...arguments2);
        this.modelClass = Keyword_1.default;
        if (typeof this.fetch === 'function') {
            this.fetch();
        }
    }
}
exports.default = KeywordCollection;
//# sourceMappingURL=KeywordCollection.js.map