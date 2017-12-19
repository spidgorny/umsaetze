"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Expenses_1 = require("../../src/Expenses/Expenses");
var Transaction_1 = require("../../src/Expenses/Transaction");
var MockStorage_1 = require("./MockStorage");
var fs = require('fs');
var Backbone = require('backbone');
var ExpensesMock = (function (_super) {
    __extends(ExpensesMock, _super);
    function ExpensesMock() {
        _super.call(this);
        this.localStorage = new MockStorage_1.default();
        this.models = [];
    }
    ExpensesMock.prototype.load = function (file) {
        var _this = this;
        var json = fs.readFileSync(file);
        var data = JSON.parse(json);
        data.forEach(function (row) {
            _this.models.push(new Transaction_1.default(row));
        });
    };
    ExpensesMock.prototype.size = function () {
        return this.models.length;
    };
    ExpensesMock.prototype.each = function (cb) {
        return this.models.forEach(function (value, index) {
            return cb(value, index);
        });
    };
    ExpensesMock.prototype.dumpVisible = function () {
        var content = [];
        this.each(function (model) {
            content.push(model.get('visible') ? '+' : '-');
        });
        console.log('visible', content.join(''));
    };
    return ExpensesMock;
}(Expenses_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExpensesMock;
