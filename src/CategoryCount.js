/// <reference path="../typings/index.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var bb = require('backbone');
var bbls = require('backbone.localstorage');
var CategoryCount = (function (_super) {
    __extends(CategoryCount, _super);
    function CategoryCount() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        _super.call(this, args);
        //this.listenTo(this, 'change', this.saveToLS);
    }
    CategoryCount.prototype.setColor = function (color) {
        this.set('color', color);
    };
    return CategoryCount;
}(bb.Model));
exports.__esModule = true;
exports["default"] = CategoryCount;
//# sourceMappingURL=CategoryCount.js.map