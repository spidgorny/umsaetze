"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CategoryCollectionModel = (function (_super) {
    __extends(CategoryCollectionModel, _super);
    function CategoryCollectionModel(collection, options) {
        _super.call(this);
        options = options || {};
        options.innerCollection = collection;
    }
    CategoryCollectionModel.prototype.getCollection = function () {
        return this.get('innerCollection');
    };
    return CategoryCollectionModel;
}(Backbone.Model));
