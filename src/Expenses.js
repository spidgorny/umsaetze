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
require('datejs');
var Expenses = (function (_super) {
    __extends(Expenses, _super);
    function Expenses() {
        _super.apply(this, arguments);
        this.attributes = null;
        this.model = Transaction_1["default"];
        this.csvUrl = '../umsaetze-1090729-2016-07-27-00-11-29.cat.csv';
    }
    Expenses.prototype.fetch = function (options) {
        var _this = this;
        console.log('csvUrl', this.csvUrl);
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
                umsaetze_1.asyncLoop(csv.data, _this.processRow.bind(_this), _this.processDone.bind(_this, options));
            }
        });
    };
    Expenses.prototype.processRow = function (row, i, length) {
        var percent = Math.round(100 * i / length);
        //console.log(row);
        $('.progress .progress-bar').width(percent + '%');
        if (row && row.amount) {
            this.add(new Transaction_1["default"](row));
        }
        //this.trigger('change');
    };
    Expenses.prototype.processDone = function (count, options) {
        console.log('asyncLoop finished', count);
        if (options.success) {
            options.success.call();
        }
        console.log('Trigger change on Expenses');
        this.trigger('change');
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
                row.set('visible', false, { noRender: true });
            }
            else {
                row.set('visible', true, { noRender: true });
            }
        });
    };
    return Expenses;
}(Backbone.Collection));
exports.__esModule = true;
exports["default"] = Expenses;
//# sourceMappingURL=Expenses.js.map