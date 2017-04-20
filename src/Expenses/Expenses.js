/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../node_modules/backbone-typings/backbone.d.ts" />
/// <reference path="../umsaetze.ts" />
/// <reference path="../Papa.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Transaction_1 = require('./Transaction');
var umsaetze_1 = require("../umsaetze");
var MonthSelect_1 = require("../MonthSelect");
var bb = require('backbone');
var BackboneLocalStorage = require("backbone.localstorage");
require('datejs');
var elapse = require('elapse');
elapse.configure({
    debug: true
});
var _ = require('underscore');
var Expenses = (function (_super) {
    __extends(Expenses, _super);
    function Expenses(models, options) {
        var _this = this;
        _super.call(this, models, options);
        this.model = Transaction_1.default;
        this.localStorage = new BackboneLocalStorage("Expenses");
        this.listenTo(this, 'change', function () {
            console.log('Expenses changed event');
            _this.saveAll();
        });
        this.on("all", umsaetze_1.debug("Expenses"));
    }
    /**
     * Should be called after constructor to read data from LS
     * @param options
     * @returns {JQueryXHR}
     */
    Expenses.prototype.fetch = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var models = this.localStorage.findAll();
        console.log('models from LS', models.length);
        if (models.length) {
            _.each(models, function (el) {
                _this.add(new Transaction_1.default(el));
            });
            //this.unserializeDate();
            this.trigger('change');
        }
    };
    /**
     * Only visible
     * @returns {Date}
     */
    Expenses.prototype.getDateFrom = function () {
        var visible = this.getVisible();
        var min = new Date().addYears(10).valueOf();
        _.each(visible, function (row) {
            var date = row.getDate().valueOf();
            if (date < min) {
                min = date;
            }
        });
        return new Date(min);
    };
    /**
     * Only visible
     * @returns {Date}
     */
    Expenses.prototype.getDateTill = function () {
        var visible = this.getVisible();
        var min = new Date('1970-01-01').valueOf();
        _.each(visible, function (row) {
            var date = row.getDate().valueOf();
            if (date > min) {
                min = date;
            }
        });
        return new Date(min);
    };
    Expenses.prototype.getEarliest = function () {
        if (!this.size()) {
            return new Date();
        }
        var max = new Date().addYears(10).valueOf();
        this.each(function (row) {
            var dDate = row.getDate();
            var date = dDate.valueOf();
            if (date < max) {
                max = date;
            }
        });
        return new Date(max);
    };
    Expenses.prototype.getLatest = function () {
        if (!this.size()) {
            return new Date();
        }
        var min = new Date('1970-01-01').valueOf();
        this.each(function (row) {
            var date = row.getDate().valueOf();
            if (date > min) {
                min = date;
            }
        });
        return new Date(min);
    };
    /**
     * show everything by default, then filters will hide
     */
    Expenses.prototype.setAllVisible = function () {
        this.each(function (model) {
            model.set('visible', true, { silent: true });
        });
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
        if (selectedMonth) {
            this.selectedMonth = selectedMonth;
        }
        else if (this.selectedMonth) {
            selectedMonth = this.selectedMonth;
        }
        else {
            //throw new Error('filterByMonth no month defined');
            var ms = MonthSelect_1.default.getInstance();
            selectedMonth = ms.getSelected();
        }
        if (selectedMonth) {
            var inThisMonth = this.whereMonth(selectedMonth);
            var allOthers = _.difference(this.models, inThisMonth);
            allOthers.forEach(function (row) {
                row.set('visible', false, { silent: true });
            });
            this.saveAll();
        }
        elapse.timeEnd('Expense.filterByMonth');
    };
    Expenses.prototype.whereMonth = function (selectedMonth) {
        var filtered = [];
        this.each(function (row) {
            var tDate = row.get('date');
            var sameYear = tDate.getFullYear() == selectedMonth.getFullYear();
            var sameMonth = tDate.getMonth() == selectedMonth.getMonth();
            if (sameYear && sameMonth) {
                filtered.push(row);
            }
        });
        return filtered;
    };
    Expenses.prototype.filterByCategory = function (category) {
        elapse.time('Expense.filterByCategory');
        this.each(function (row) {
            if (row.isVisible()) {
                var rowCat = row.get('category');
                var isVisible = category.getName() == rowCat;
                //console.log('set visible', isVisible);
                row.set('visible', isVisible, { silent: true });
            }
        });
        this.saveAll();
        elapse.timeEnd('Expense.filterByCategory');
    };
    Expenses.prototype.saveAll = function () {
        var _this = this;
        elapse.time('Expense.saveAll');
        this.localStorage._clear();
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
    Expenses.prototype.getSorted = function () {
        this.comparator = 'date';
        this.sort();
        var visible = this.getVisible();
        // return _.sortBy(visible, 'attributes.date');
        return visible;
    };
    Expenses.prototype.setCategories = function (keywords) {
        this.each(function (row) {
            if (row.get('category') == 'Default') {
                keywords.each(function (key) {
                    //console.log(key);
                    var note = row.get('note');
                    if (note.indexOf(key.word) > -1) {
                        console.log(note, 'contains', key.word, 'gets', key.category);
                        row.set('category', key.category, { silent: true });
                    }
                });
            }
        });
        this.trigger('change');
    };
    /**
     * TODO: generate matrix separately and then return only the value in a grid.
     * JavaScript is so fast it's tempting to ignore this
     * @param category
     * @returns {{}}
     */
    Expenses.prototype.getMonthlyTotalsFor = function (category) {
        var sparks = {};
        var from = this.getEarliest().moveToFirstDayOfMonth();
        var till = this.getLatest().moveToLastDayOfMonth();
        // console.log({
        // 	from: from.toString('yyyy-MM-dd HH:mm'),
        // 	till: till.toString('yyyy-MM-dd HH:mm'),
        // });
        var count = 0;
        var _loop_1 = function(month) {
            var month1 = month.clone();
            month1.addMonths(1).add(-1).minutes();
            // console.log({
            // 	month: month.toString('yyyy-MM-dd HH:mm'),
            // 	month1: month1.toString('yyyy-MM-dd HH:mm'),
            // 	today_is_between: Date.today().between(month, month1)
            // });
            var sum = 0;
            this_1.each(function (transaction) {
                var sameCategory = transaction.get('category') == category.getName();
                var sameMonth = transaction.getDate().between(month, month1);
                if (sameCategory && sameMonth) {
                    // if (category.getName() == 'Darlehen' && month.toString('yyyy-MM-dd') == '2014-09-01') {
                    // 	console.log({
                    // 		transDate: transaction.getDate().toString('yyyy-MM-dd HH:mm'),
                    // 		transAmount: transaction.getAmount(),
                    // 		month: month.toString('yyyy-MM-dd HH:mm'),
                    // 		month1: month1.toString('yyyy-MM-dd HH:mm'),
                    // 	});
                    // }
                    sum += transaction.getAmount();
                    count++;
                    category.incrementCount();
                }
            });
            sparks[month.toString('yyyy-MM')] = Math.abs(sum).toFixed(2);
        };
        var this_1 = this;
        for (var month = from; month.compareTo(till) == -1; month.addMonths(1)) {
            _loop_1(month);
        }
        //console.log(category.getName(), count);
        category.set('count', count, { silent: true });
        return sparks;
    };
    Expenses.prototype.replaceCategory = function (oldName, newName) {
        this.each(function (transaction) {
            if (transaction.get('category') == oldName) {
                transaction.set('category', newName, { silent: true });
            }
        });
    };
    Expenses.prototype.clear = function () {
        this.reset(null);
    };
    Expenses.prototype.map = function (fn) {
        return _.map(this.models, fn);
    };
    /**
     * This is supposed to be used after this.filterByMonth()
     */
    Expenses.prototype.stepBackTillSalary = function (ms) {
        var selectedMonth = ms.getSelected();
        if (selectedMonth) {
            var selectedMonthMinus1 = selectedMonth.clone().addMonths(-1);
            var prevMonth = this.whereMonth(selectedMonthMinus1);
            var max_1 = _.reduce(prevMonth, function (acc, row) {
                return Math.max(acc, row.get('amount'));
            }, 0);
            //console.log(selectedMonthMinus1.toString('yyyy-MM-dd'), prevMonth.length, max);
            var doAppend_1 = false;
            prevMonth.forEach(function (row) {
                if (row.get('amount') == max_1) {
                    doAppend_1 = true;
                }
                if (doAppend_1) {
                    row.set('visible', true);
                }
            });
        }
    };
    return Expenses;
}(bb.Collection));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Expenses;
