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
var Expenses = (function (_super) {
    __extends(Expenses, _super);
    function Expenses() {
        _super.call(this);
        this.attributes = null;
        this.model = Transaction_1["default"];
        this.csvUrl = '../umsaetze-1090729-2016-07-27-00-11-29.cat.csv';
        this.slowUpdateLoadingBar = _.throttle(this.updateLoadingBar, 128);
        this.localStorage = new Backbone.LocalStorage("Expenses");
    }
    Expenses.prototype.fetch = function (options) {
        var _this = this;
        console.log('csvUrl', this.csvUrl);
        this.startLoading();
        return $.get(this.csvUrl, function (response, xhr) {
            var csv = Papa.parse(response, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true
            });
            //console.log(csv);
            if (false) {
                _.each(csv.data, _this.processRow.bind(_this));
                _this.processDone(csv.data.length, options);
            }
            else {
                _this.prevPercent = 0;
                umsaetze_1.asyncLoop(csv.data, _this.processRow.bind(_this), _this.processDone.bind(_this, options));
            }
        });
    };
    Expenses.prototype.processRow = function (row, i, length) {
        this.slowUpdateLoadingBar(i, length);
        if (row && row.amount) {
            this.add(new Transaction_1["default"](row));
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
        console.log('asyncLoop finished', count);
        if (options.success) {
            options.success.call();
        }
        console.log('Trigger change on Expenses');
        this.stopLoading();
        this.trigger('change');
    };
    Expenses.prototype.startLoading = function () {
        console.log('startLoading');
        var template = _.template($('#loadingBarTemplate').html());
        $('#app').html(template());
    };
    Expenses.prototype.stopLoading = function () {
        console.log('stopLoading');
        $('#app').html('Done');
    };
    Expenses.prototype.getDateFrom = function () {
        var min = new Date().valueOf();
        this.each(function (row) {
            var date = row.get('date').valueOf();
            if (date < min) {
                min = date;
            }
        });
        return new Date(min);
    };
    Expenses.prototype.getDateTill = function () {
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
        this.each(function (row) {
            if (row.get('note').indexOf(q) == -1) {
                row.set('visible', false, { noRender: true, silent: true });
            }
            else {
                row.set('visible', true, { noRender: true, silent: true });
            }
        });
    };
    return Expenses;
}(Backbone.Collection));
exports.__esModule = true;
exports["default"] = Expenses;
//# sourceMappingURL=Expenses.js.map