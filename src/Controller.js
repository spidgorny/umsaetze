"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// import {Model} from "backbone";
var Backbone = require('backbone');
var Controller = (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        _super.apply(this, arguments);
    }
    Controller.prototype.hide = function () {
        this.$el.hide();
    };
    return Controller;
}(Backbone.View));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Controller;
