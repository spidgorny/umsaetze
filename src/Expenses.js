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
var umsaetze_1 = require('./umsaetze');
var Transaction_1 = require('./Transaction');
Backbone.LocalStorage = require("backbone.localstorage");
require('datejs');
var elapse = require('elapse');
elapse.configure({
    debug: true
});
var Expenses = (function (_super) {
    __extends(Expenses, _super);
    //url = 'expenses/';
    function Expenses() {
        _super.call(this);
        this.attributes = null;
        this.model = Transaction_1["default"];
        this.csvUrl = '../umsaetze-1090729-2016-07-27-00-11-29.cat.csv';
        this.slowUpdateLoadingBar = _.throttle(this.updateLoadingBar, 128);
        this.localStorage = new Backbone.LocalStorage("Expenses");
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
            this.add(models);
            //this.unserializeDate();
            this.trigger('change');
            return;
        }
        else {
            return this.fetchCSV(_.extend(options || {}, {
                success: function () {
                    elapse.time('Expense.saveModels2LS');
                    console.log('models loaded, saving to LS');
                    _this.each(function (model) {
                        _this.localStorage.create(model);
                    });
                    elapse.timeEnd('Expense.saveModels2LS');
                }
            }));
        }
    };
    Expenses.prototype.fetchCSV = function (options) {
        var _this = this;
        console.log('csvUrl', this.csvUrl);
        console.log('options', options);
        this.startLoading();
        return $.get(this.csvUrl, function (response, xhr) {
            var csv = Papa.parse(response, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true
            });
            //console.log(csv);
            var processWithoutVisualFeedback = false;
            if (processWithoutVisualFeedback) {
                _.each(csv.data, _this.processRow.bind(_this));
                _this.processDone(csv.data.length, options);
            }
            else {
                umsaetze_1.asyncLoop(csv.data, _this.processRow.bind(_this), _this.processDone.bind(_this, csv.data.length, options));
            }
        });
    };
    Expenses.prototype.processRow = function (row, i, length) {
        this.slowUpdateLoadingBar(i, length);
        if (row && row.amount) {
            this.add(new Transaction_1["default"](row), { silent: true });
        }
    };
    Expenses.prototype.updateLoadingBar = function (i, length) {
        var percent = Math.round(100 * i / length);
        //console.log('updateLoadingBar', i, percent);
        if (percent != this.prevPercent) {
            //console.log(percent);
            $('.progress#loadingBar .progress-bar').width(percent + '%');
            this.prevPercent = percent;
        }
    };
    Expenses.prototype.processDone = function (count, options) {
        console.log('asyncLoop finished', count, options);
        if (options && options.success) {
            options.success();
        }
        console.log('Trigger change on Expenses');
        this.stopLoading();
        this.trigger('change');
    };
    Expenses.prototype.startLoading = function () {
        console.log('startLoading');
        this.prevPercent = 0;
        var template = _.template($('#loadingBarTemplate').html());
        $('#app').html(template());
    };
    Expenses.prototype.stopLoading = function () {
        console.log('stopLoading');
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
            var date = row.get('date').valueOf();
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
    Expenses.prototype.filterVisible = function (q) {
        elapse.time('Expense.filterVisible');
        var lowQ = q.toLowerCase();
        this.each(function (row) {
            if (row.get('note').toLowerCase().indexOf(lowQ) == -1) {
                row.set('visible', false, { silent: true });
            }
            else {
                row.set('visible', true, { silent: true });
            }
        });
        elapse.timeEnd('Expense.filterVisible');
        this.saveAll();
    };
    Expenses.prototype.filterByMonth = function (selectedMonth) {
        elapse.time('Expense.filterByMonth');
        this.each(function (row) {
            var tDate = row.get('date');
            var sameYear = tDate.getFullYear() == selectedMonth.getFullYear();
            var sameMonth = tDate.getMonth() == selectedMonth.getMonth();
            if (sameYear && sameMonth) {
                row.set('visible', true, { silent: true });
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