///<reference path="../../typings/index.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Expenses_1 = require("../../src/Expenses/Expenses");
var Transaction_1 = require("../../src/Expenses/Transaction");
var fs = require('fs');
var Backbone = require('backbone');
var ExpensesMock = (function (_super) {
    __extends(ExpensesMock, _super);
    function ExpensesMock() {
        this.data = [];
    }
    ExpensesMock.prototype.load = function (file) {
        var _this = this;
        var json = fs.readFileSync(file);
        var data = JSON.parse(json);
        data.forEach(function (row) {
            _this.data.push(new Transaction_1.default(row));
        });
    };
    ExpensesMock.prototype.size = function () {
        return this.data.length;
    };
    ExpensesMock.prototype.each = function (cb) {
        return this.data.forEach(cb);
    };
    return ExpensesMock;
}(Expenses_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExpensesMock;
