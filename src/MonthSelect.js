///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
///<reference path="../typings/index.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Backbone = require('backbone');
require('datejs');
var MonthSelect = (function (_super) {
    __extends(MonthSelect, _super);
    function MonthSelect() {
        _super.call(this);
        this.$el = $('#MonthSelect');
        this.yearSelect = this.$('select');
        this.monthOptions = this.$('button');
        this.selectedYear = this.yearSelect.val();
        this.selectedMonth = 'Feb';
        this.earliest = new Date('2014-08-01');
        this.latest = new Date('2016-05-15');
        // console.log(this.yearSelect);
        // console.log(this.monthOptions);
        this.monthOptions.on('click', this.clickOnMonth.bind(this));
        this.yearSelect.on('change', this.changedMonth.bind(this));
        this.localStorage = new Backbone.LocalStorage('MonthSelect');
        //this.localStorage.localStorage().
    }
    MonthSelect.prototype.render = function () {
        var _this = this;
        var sSelectedDate = this.selectedYear + '-' + (1 + Date.getMonthNumberFromName(this.selectedMonth)) + '-01';
        var selectedDate = new Date(sSelectedDate);
        console.log('selectedDate', sSelectedDate, selectedDate);
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
        return this;
    };
    MonthSelect.prototype.show = function () {
        console.log('MonthSelect.show');
        this.$el.show();
    };
    MonthSelect.prototype.hide = function () {
        console.log('MonthSelect.hide');
        this.$el.hide();
    };
    MonthSelect.prototype.clickOnMonth = function (event) {
        this.monthOptions.removeClass('btn-success').addClass('btn-default');
        var $button = $(event.target);
        $button.removeClass('btn-default');
        $button.addClass('btn-success');
        this.selectedMonth = $button.text();
    };
    MonthSelect.prototype.changedMonth = function (event) {
        this.selectedYear = this.yearSelect.val();
        console.log(this.selectedYear);
        this.render();
    };
    return MonthSelect;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = MonthSelect;
//# sourceMappingURL=MonthSelect.js.map