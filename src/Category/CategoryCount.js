/// <reference path="../../typings/index.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Backbone = require('backbone');
// const bbls = require('backbone.localstorage');
Object.values = function (obj) { return Object.keys(obj).map(function (key) { return obj[key]; }); };
var CategoryCount = (function (_super) {
    __extends(CategoryCount, _super);
    function CategoryCount() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        _super.call(this);
        this.set('catName', args[0].catName); // this should not be necessary but it is
        this.set('color', args[0].color); // this should not be necessary but it is
        this.set('count', args[0].count); // this should not be necessary but it is
        this.set('amount', args[0].amount); // this should not be necessary but it is
        this.set('id', args[0].id); // this should not be necessary but it is
        //this.listenTo(this, 'change', this.saveToLS);
        var color = this.get('color');
        if (!color) {
            this.set('color', this.pastelColor());
        }
        var count = this.get('count');
        if (!count) {
            this.set('count', 0);
        }
        var amount = this.get('amount');
        if (!amount) {
            this.set('amount', 0);
        }
    }
    CategoryCount.prototype.setColor = function (color) {
        this.set('color', color);
    };
    CategoryCount.prototype.pastelColor = function () {
        var r = (Math.round(Math.random() * 55) + 200).toString(16);
        var g = (Math.round(Math.random() * 55) + 200).toString(16);
        var b = (Math.round(Math.random() * 55) + 200).toString(16);
        return '#' + r + g + b;
    };
    CategoryCount.prototype.getName = function () {
        return this.get('catName');
    };
    CategoryCount.prototype.getAmount = function () {
        return this.get('amount').toFixed(2);
    };
    CategoryCount.prototype.resetCounters = function () {
        this.set('count', 0, { silent: true });
        // this.set('amount', 0, { silent: true });
    };
    CategoryCount.prototype.incrementCount = function () {
        this.set('count', this.get('count') + 1, { silent: true });
    };
    /**
     * @deprecated - spoils CategoryView
     * @param by
     */
    CategoryCount.prototype.incrementAmountBy = function (by) {
        this.set('amount', this.get('amount') + by, { silent: true });
    };
    CategoryCount.prototype.getAverageAmountPerMonth = function (totalsPerMonth) {
        var totals = Object.values(totalsPerMonth);
        var sum = totals.reduce(function (a, b) { return parseFloat(a) + parseFloat(b); });
        var avg = sum / totals.length;
        //console.log(totals, sum, avg);
        return avg.toFixed(2);
    };
    return CategoryCount;
}(Backbone.Model));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CategoryCount;
