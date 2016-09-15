/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/backbone-typings/backbone.d.ts" />
/// <reference path="umsaetze.ts" />
/// <reference path="Papa.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Transaction_1 = require('./Transaction');
var Backbone = require('backbone');
var BackboneLocalStorage = require("backbone.localstorage");
require('datejs');
var elapse = require('elapse');
elapse.configure({
    debug: true
});
var $ = require('jquery');
var _ = require('underscore');
var Expenses = (function (_super) {
    __extends(Expenses, _super);
    //url = 'expenses/';
    function Expenses() {
        _super.call(this);
        this.attributes = null;
        this.model = Transaction_1["default"];
        this.localStorage = new BackboneLocalStorage("Expenses");
        this.listenTo(this, 'change', function () {
            console.log('Expenses changed event');
        });
    }
    /**
     * Should be called after constructor to read data from LS
     * @param options
     * @returns {JQueryXHR}
     */
    Expenses.prototype.fetch = function (options) {
        if (options === void 0) { options = {}; }
        var models = this.localStorage.findAll();
        console.log('models from LS', models.length);
        if (models.length) {
            this.add(models);
            //this.unserializeDate();
            this.trigger('change');
            return;
        }
    };
    /**
     * show everything by default, then filters will hide
     */
    Expenses.prototype.setAllVisible = function () {
        this.each(function (model) {
            model.set('visible', true, { silent: true });
        });
    };
    Expenses.prototype.getDateFrom = function () {
        var visible = this.getVisible();
        var min = new Date().addYears(10).valueOf();
        _.each(visible, function (row) {
            var date = row.get('date').valueOf();
            if (date < min) {
                min = date;
            }
        });
        return new Date(min);
    };
    Expenses.prototype.getDateTill = function () {
        var visible = this.getVisible();
        var min = new Date('1970-01-01').valueOf();
        _.each(visible, function (row) {
            var date = row.get('date').valueOf();
            if (date > min) {
                min = date;
            }
        });
        return new Date(min);
    };
    Expenses.prototype.getEarliest = function () {
        var min = new Date().addYears(10).valueOf();
        this.each(function (row) {
            var dDate = row.get('date');
            if (!dDate) {
                console.log('getEarliest', dDate, row);
            }
            var date = dDate.valueOf();
            if (date < min) {
                min = date;
            }
        });
        return new Date(min);
    };
    Expenses.prototype.getLatest = function () {
        var min = new Date('1970-01-01').valueOf();
        this.each(function (row) {
            var date = row.get('date').valueOf();
            if (date > min) {
                min = date;
            }
        });
        return new Date(min);
    };
    /**
     * Will hide some visible
     * @param q
     */
    Expenses.prototype.filterVisible = function (q) {
        if (!q.length)
            return;
        elapse.time('Expense.filterVisible');
        var lowQ = q.toLowerCase();
        this.each(function (row) {
            if (row.get('note').toLowerCase().indexOf(lowQ) == -1) {
                row.set('visible', false, { silent: true });
            }
            else {
            }
        });
        elapse.timeEnd('Expense.filterVisible');
        this.saveAll();
    };
    /**
     * Will hide some visible
     * @param selectedMonth
     */
    Expenses.prototype.filterByMonth = function (selectedMonth) {
        elapse.time('Expense.filterByMonth');
        this.each(function (row) {
            var tDate = row.get('date');
            var sameYear = tDate.getFullYear() == selectedMonth.getFullYear();
            var sameMonth = tDate.getMonth() == selectedMonth.getMonth();
            if (sameYear && sameMonth) {
            }
            else {
                row.set('visible', false, { silent: true });
            }
        });
        elapse.timeEnd('Expense.filterByMonth');
        this.saveAll();
    };
    Expenses.prototype.saveAll = function () {
        var _this = this;
        elapse.time('Expense.saveAll');
        this.each(function (model) {
            _this.localStorage.update(model);
        });
        elapse.timeEnd('Expense.saveAll');
    };
    Expenses.prototype.getVisibleCount = function () {
        return this.getVisible().length;
    };
    /**
     * @deprecated
     */
    Expenses.prototype.unserializeDate = function () {
        elapse.time('Expense.unserializeDate');
        this.each(function (model) {
            var sDate = model.get('date');
            var dateObject = new Date(sDate);
            console.log(sDate, dateObject);
            model.set('date', dateObject);
        });
        elapse.timeEnd('Expense.unserializeDate');
    };
    Expenses.prototype.getVisible = function () {
        return this.where({ visible: true });
    };
    return Expenses;
}(Backbone.Collection));
exports.__esModule = true;
exports["default"] = Expenses;
//# sourceMappingURL=Expenses.js.map