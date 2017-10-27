"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Backbone = require("backbone");
var CategoryCollectionModel = /** @class */ (function (_super) {
    __extends(CategoryCollectionModel, _super);
    function CategoryCollectionModel(collection, options) {
        var _this = _super.call(this) || this;
        options = options || {};
        options.innerCollection = collection;
        return _this;
    }
    CategoryCollectionModel.prototype.getCollection = function () {
        return this.get('innerCollection');
    };
    return CategoryCollectionModel;
}(Backbone.Model));
exports.default = CategoryCollectionModel;
