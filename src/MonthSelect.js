///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
///<reference path="../typings/index.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Backbone = require('backbone');
var $ = require('jquery');
require('datejs');
var _ = require('underscore');
var MonthSelect = (function (_super) {
    __extends(MonthSelect, _super);
    //localStorage: Backbone.LocalStorage;
    function MonthSelect() {
        _super.call(this);
        this.$el = $('#MonthSelect');
        this.yearSelect = this.$('select');
        this.monthOptions = this.$('button');
        this.selectedYear = this.yearSelect.val();
        this.selectedMonth = 'Feb';
        this.earliest = new Date();
        this.latest = new Date();
        /**
         * http://stackoverflow.com/questions/1643320/get-month-name-from-date
         * @type {[string,string,string,string,string,string,string,string,string,string,string,string]}
         */
        this.monthNames = [
            "January", "February", "March",
            "April", "May", "June",
            "July", "August", "September",
            "October", "November", "December"
        ];
        // console.log(this.yearSelect);
        // console.log(this.monthOptions);
        this.monthOptions.on('click', this.clickOnMonth.bind(this));
        this.yearSelect.on('change', this.changeYear.bind(this));
        //this.localStorage = new Backbone.LocalStorage('MonthSelect');
        var year = window.localStorage.getItem('MonthSelect.year');
        if (year) {
            this.selectedYear = year;
        }
        var month = window.localStorage.getItem('MonthSelect.month');
        if (month) {
            this.selectedMonth = month;
        }
    }
    MonthSelect.prototype.render = function () {
        var _this = this;
        console.time('MonthSelect.render');
        this.earliest.moveToFirstDayOfMonth();
        var selectedDate = this.getSelected();
        this.monthOptions.each(function (i, button) {
            var monthNumber = i + 1;
            //console.log(button);
            var sDate = _this.selectedYear + '-' + monthNumber + '-01';
            var firstOfMonth = new Date(sDate);
            var $button = $(button);
            var isAfter = firstOfMonth.isAfter(_this.earliest);
            var isBefore = firstOfMonth.isBefore(_this.latest);
            if (isAfter && isBefore) {
                $button.removeAttr('disabled');
            }
            else {
                $button.attr('disabled', 'disabled');
            }
            var equals = firstOfMonth.equals(selectedDate);
            if (equals) {
                $button.addClass('btn-success').removeClass('btn-default');
            }
            else {
                $button.removeClass('btn-success').addClass('btn-default');
            }
            //console.log(sDate, firstOfMonth, isAfter, isBefore, equals);
        });
        console.timeEnd('MonthSelect.render');
        return this;
    };
    MonthSelect.prototype.show = function () {
        console.log('MonthSelect.show');
        this.$el.show();
        this.render(); // required as data may have changed (all disabled bug)
    };
    MonthSelect.prototype.hide = function () {
        console.log('MonthSelect.hide');
        this.$el.hide();
    };
    MonthSelect.prototype.getMonthIndex = function () {
        var result = Date.getMonthNumberFromName(this.selectedMonth) + 1;
        console.log('getMonthIndex', this.selectedMonth, result);
        return result;
    };
    MonthSelect.prototype.getMonthIndexFor = function (monthName) {
        var result = Date.getMonthNumberFromName(monthName) + 1;
        console.log('getMonthIndex', monthName, result);
        return result;
    };
    MonthSelect.prototype.getMonthNameFor = function (index) {
        return this.getShortMonthNameFor(index);
    };
    MonthSelect.prototype.changeYear = function (event) {
        // this.selectedYear = this.yearSelect.val();	// don't set yet - URL will do
        Backbone.history.navigate('#/' + this.yearSelect.val() + '/' + this.getMonthIndex());
    };
    MonthSelect.prototype.clickOnMonth = function (event) {
        this.monthOptions.removeClass('btn-success').addClass('btn-default');
        var $button = $(event.target);
        $button.removeClass('btn-default');
        $button.addClass('btn-success');
        //this.selectedMonth = $button.text();	// don't set yet - URL will do
        Backbone.history.navigate('#/' + this.selectedYear + '/' + this.getMonthIndexFor($button.text()));
    };
    MonthSelect.prototype.setYear = function (year) {
        // if (this.selectedYear == year) return;
        console.log('setYear', year);
        this.selectedYear = year;
        //console.log(this.selectedYear);
        window.localStorage.setItem('MonthSelect.year', this.selectedYear);
        this.render(); // repaint months as available or not
        this.trigger('MonthSelect:change');
    };
    MonthSelect.prototype.setMonth = function (month) {
        var monthName = this.getMonthNameFor(month);
        // if (this.selectedMonth == monthName) {
        // 	console.warn('same month', this.selectedMonth, monthName);
        // 	return;
        // }
        console.log('setMonth', month);
        this.selectedMonth = monthName;
        window.localStorage.setItem('MonthSelect.month', this.selectedMonth);
        this.trigger('MonthSelect:change');
    };
    MonthSelect.prototype.setYearMonth = function (year, month) {
        console.log('setYearMonth', year, month);
        this.selectedYear = year;
        //console.log(this.selectedYear);
        window.localStorage.setItem('MonthSelect.year', this.selectedYear);
        var monthName = this.getMonthNameFor(month);
        this.selectedMonth = monthName;
        window.localStorage.setItem('MonthSelect.month', this.selectedMonth);
        this.render(); // repaint months as available or not
        this.trigger('MonthSelect:change');
    };
    MonthSelect.prototype.trigger = function (what) {
        console.warn(what);
        _super.prototype.trigger.call(this, what);
    };
    /**
     * @public
     * @returns {Date}
     */
    MonthSelect.prototype.getSelected = function () {
        var sSelectedDate = this.selectedYear + '-' + this.getMonthIndex() + '-01';
        var selectedDate = new Date(sSelectedDate);
        console.log('selectedDate', sSelectedDate, selectedDate);
        return selectedDate;
    };
    MonthSelect.prototype.getMonthName = function () {
        return this.monthNames[this.selectedMonth];
    };
    MonthSelect.prototype.getShortMonthName = function () {
        return this.getMonthName().substr(0, 3);
    };
    MonthSelect.prototype.getShortMonthNameFor = function (index) {
        return this.monthNames[index - 1].substr(0, 3);
    };
    ;
    return MonthSelect;
}(Backbone.View));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MonthSelect;
//# sourceMappingURL=MonthSelect.js.map