///<reference path="../typings/index.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Collection_1 = require('./Collection');
var Keyword_1 = require('./Keyword');
var KeywordCollection = (function (_super) {
    __extends(KeywordCollection, _super);
    function KeywordCollection() {
        _super.call(this);
        this.modelClass = Keyword_1["default"];
        this.fetch();
    }
    return KeywordCollection;
}(Collection_1["default"]));
exports.__esModule = true;
exports["default"] = KeywordCollection;
//# sourceMappingURL=KeywordCollection.js.map