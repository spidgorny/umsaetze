///<reference path="../../typings/index.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Backbone = require('backbone');
var MyView = (function (_super) {
    __extends(MyView, _super);
    function MyView() {
        _super.apply(this, arguments);
    }
    return MyView;
}(Backbone.View));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MyView;
