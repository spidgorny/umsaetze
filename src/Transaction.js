"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../typings/index.d.ts"/>
var md5 = require('md5');
var bb = require('backbone');
/*
 {"account":"SpardaSlawa",
 "category":"Einkauf",
 "currency":"EUR",
 "amount":-23.99,
 "payment_type":"DEBIT_CARD",
 "date": "",
 "note": "",
 "id": "",
 "visible": false,
 "sign": ""
 */
var Transaction = (function (_super) {
    __extends(Transaction, _super);
    function Transaction(attributes, options) {
        _super.call(this, attributes, options);
        this.defaults = {
            visible: true
        };
        var dDate;
        var sDate = this.get('date');
        if (sDate instanceof Date) {
            dDate = sDate.clone();
            sDate = dDate.toString('d.M.yyyy');
        }
        else {
            dDate = new Date(sDate); // to parse from JSON
            var dDateValid = !isNaN(dDate.getTime());
            if (!dDate || !dDateValid) {
                dDate = Date.parseExact(sDate, "d.M.yyyy");
            }
            this.set('date', dDate);
        }
        //console.log(sDate, dDate);
        if (!this.get('id')) {
            this.set('id', md5(sDate + this.get('amount')));
        }
        // number
        this.set('amount', parseFloat(this.get('amount')));
        if (!this.has('visible')) {
            this.set('visible', true);
        }
    }
    Transaction.prototype.sign = function () {
        return this.get('amount') >= 0 ? 'positive' : 'negative';
    };
    Transaction.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.sign = this.sign();
        json.id = this.id;
        return json;
    };
    Transaction.prototype.setCategory = function (category) {
        this.set('category', category);
        this.collection.localStorage.update(this);
    };
    /**
     * This will return Date object any time
     */
    Transaction.prototype.getDate = function () {
        var date = this.get('date');
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return date;
    };
    Transaction.prototype.isVisible = function () {
        return this.get('visible');
    };
    return Transaction;
}(bb.Model));
exports.__esModule = true;
exports["default"] = Transaction;
//# sourceMappingURL=Transaction.js.map