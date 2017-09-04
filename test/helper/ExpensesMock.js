"use strict";
///<reference path="../../typings/index.d.ts"/>
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
exports.__esModule = true;
var Expenses_1 = require("../../src/Expenses/Expenses");
var Transaction_1 = require("../../src/Expenses/Transaction");
var MockStorage_1 = require("./MockStorage");
var fs = require('fs');
var Backbone = require('backbone');
var ExpensesMock = /** @class */ (function (_super) {
    __extends(ExpensesMock, _super);
    function ExpensesMock() {
        var _this = this;
        _this.localStorage = new MockStorage_1["default"]();
        _this.models = [];
        return _this;
    }
    ExpensesMock.prototype.load = function (file) {
        var _this = this;
        var json = fs.readFileSync(file);
        var data = JSON.parse(json);
        data.forEach(function (row) {
            _this.models.push(new Transaction_1["default"](row));
        });
    };
    ExpensesMock.prototype.size = function () {
        return this.models.length;
    };
    ExpensesMock.prototype.each = function (cb) {
        return this.models.forEach(cb);
    };
    ExpensesMock.prototype.dumpVisible = function () {
        var content = [];
        this.each(function (model) {
            content.push(model.get('visible') ? '+' : '-');
        });
        console.log('visible', content.join(''));
    };
    return ExpensesMock;
}(Expenses_1["default"]));
exports["default"] = ExpensesMock;
