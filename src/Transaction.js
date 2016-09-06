"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../typings/index.d.ts"/>
///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
var md5 = require('md5');
var Transaction = (function (_super) {
    __extends(Transaction, _super);
    function Transaction(attributes, options) {
        _super.call(this, attributes, options);
        this.id = md5(this.get('date') + this.get('amount'));
    }
    Transaction.prototype.sign = function () {
        return this.amount >= 0 ? 'positive' : 'negative';
    };
    Transaction.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.sign = this.sign();
        json.id = this.id;
        return json;
    };
    return Transaction;
}(Backbone.Model));
exports.__esModule = true;
exports["default"] = Transaction;
//# sourceMappingURL=Transaction.js.map