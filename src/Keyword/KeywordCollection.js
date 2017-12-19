"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CollectionArray_1 = require('./CollectionArray');
var Keyword_1 = require('./Keyword');
var KeywordCollection = (function (_super) {
    __extends(KeywordCollection, _super);
    function KeywordCollection() {
        var arguments2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arguments2[_i - 0] = arguments[_i];
        }
        _super.apply(this, arguments2);
        this.modelClass = Keyword_1.default;
        this.fetch();
    }
    return KeywordCollection;
}(CollectionArray_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = KeywordCollection;
