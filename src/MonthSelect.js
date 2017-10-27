var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Backbone from 'backbone-es6/src/Backbone.js';
import $ from 'jquery';
var MonthSelect = (function (_super) {
    __extends(MonthSelect, _super);
    function MonthSelect() {
        var _this = _super.call(this) || this;
        _this.$el = $('#MonthSelect');
        _this.yearSelect = _this.$('select');
        _this.monthOptions = _this.$('button');
        _this.selectedYear = parseInt(_this.yearSelect.val() + '') || new Date().getFullYear();
        _this.selectedMonth = 'Feb';
        _this.earliest = new Date();
        _this.latest = new Date();
        _this.monthNames = [
            "January", "February", "March",
            "April", "May", "June",
            "July", "August", "September",
            "October", "November", "December"
        ];
        if (!_this.storageProvider) {
            _this.storageProvider = window.localStorage;
        }
        _this.monthOptions.on('click', _this.clickOnMonth.bind(_this));
        _this.yearSelect.on('change', _this.changeYear.bind(_this));
        var year = _this.storageProvider.getItem('MonthSelect.year');
        if (year) {
            _this.selectedYear = parseInt(year);
        }
        var month = _this.storageProvider.getItem('MonthSelect.month');
        if (month) {
            _this.selectedMonth = month;
        }
        return _this;
    }
    MonthSelect.getInstance = function () {
        if (!MonthSelect.instance) {
            MonthSelect.instance = new MonthSelect();
        }
        return MonthSelect.instance;
    };
    MonthSelect.prototype.render = function () {
        var _this = this;
        this.earliest.moveToFirstDayOfMonth();
        var selectedDate = this.getSelected();
        var options = [];
        var minYear = this.earliest.getFullYear();
        var maxYear = this.latest.getFullYear();
        for (var y = minYear; y <= maxYear; y++) {
            var selected = selectedDate.getFullYear() == y ? 'selected' : '';
            options.push('<option ' + selected + '>' + y + '</option>');
        }
        this.yearSelect.html(options.join("\n"));
        this.monthOptions.each(function (i, button) {
            var monthNumber = i + 1;
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
        });
        return this;
    };
    MonthSelect.prototype.show = function () {
        this.$el.show();
        this.render();
    };
    MonthSelect.prototype.hide = function () {
        console.error('MonthSelect.hide');
        this.$el.hide();
    };
    MonthSelect.prototype.getMonthIndex = function () {
        var result = Date.getMonthNumberFromName(this.selectedMonth) + 1;
        return result;
    };
    MonthSelect.prototype.getMonthIndexFor = function (monthName) {
        var result = Date.getMonthNumberFromName(monthName) + 1;
        return result;
    };
    MonthSelect.prototype.getMonthNameFor = function (index) {
        return this.getShortMonthNameFor(index);
    };
    MonthSelect.prototype.changeYear = function (event) {
        Backbone.history.navigate('#/' + this.yearSelect.val() + '/' + this.getMonthIndex());
    };
    MonthSelect.prototype.clickOnMonthAndNavigate = function (event) {
        this.monthOptions.removeClass('btn-success').addClass('btn-default');
        var $button = $(event.target);
        $button.removeClass('btn-default');
        $button.addClass('btn-success');
        var monthIndex = this.getMonthIndexFor($button.text());
        Backbone.history.navigate('#/' + this.selectedYear + '/' + monthIndex);
    };
    MonthSelect.prototype.clickOnMonth = function (event) {
        this.monthOptions.removeClass('btn-success').addClass('btn-default');
        var $button = $(event.target);
        $button.removeClass('btn-default');
        $button.addClass('btn-success');
        this.selectedMonth = $button.text();
        this.storageProvider.setItem('MonthSelect.month', this.selectedMonth);
        this.trigger('MonthSelect:change');
    };
    MonthSelect.prototype.setYear = function (year) {
        console.log('setYear', year);
        this.selectedYear = year;
        this.storageProvider.setItem('MonthSelect.year', this.selectedYear + '');
        this.render();
        this.trigger('MonthSelect:change');
    };
    MonthSelect.prototype.setMonth = function (month) {
        var monthName = this.getMonthNameFor(month);
        console.log('setMonth', month);
        this.selectedMonth = monthName;
        this.storageProvider.setItem('MonthSelect.month', this.selectedMonth);
        this.trigger('MonthSelect:change');
    };
    MonthSelect.prototype.setYearMonth = function (year, month) {
        console.log('setYearMonth', year, month);
        this.selectedYear = year;
        this.storageProvider.setItem('MonthSelect.year', this.selectedYear);
        var monthName = this.getMonthNameFor(month);
        this.selectedMonth = monthName;
        this.storageProvider.setItem('MonthSelect.month', this.selectedMonth);
        this.render();
        this.trigger('MonthSelect:change');
    };
    MonthSelect.prototype.trigger = function (what) {
        console.warn(what);
        _super.prototype.trigger.call(this, what);
    };
    MonthSelect.prototype.getSelected = function () {
        var sSelectedDate = this.selectedYear + '-' + this.getMonthIndex() + '-01';
        var selectedDate = new Date(sSelectedDate);
        return selectedDate;
    };
    MonthSelect.prototype.getMonthName = function () {
        throw new Error('getMonthName called when selectedMonth is a string already');
        return this.monthNames[this.selectedMonth];
    };
    MonthSelect.prototype.getShortMonthName = function () {
        return this.getMonthName().substr(0, 3);
    };
    MonthSelect.prototype.getShortMonthNameFor = function (index) {
        return this.monthNames[index - 1].substr(0, 3);
    };
    MonthSelect.prototype.update = function (collection) {
        this.earliest = collection.getEarliest();
        this.latest = collection.getLatest();
        this.selectedYear = this.selectedYear.clamp(this.earliest.getFullYear(), this.latest.getFullYear());
        var selectedMonthIndex = this.getMonthIndex().clamp(this.earliest.getMonth(), this.latest.getMonth());
        this.selectedMonth = this.getShortMonthNameFor(selectedMonthIndex);
        this.show();
    };
    return MonthSelect;
}(Backbone.View));
export default MonthSelect;
//# sourceMappingURL=MonthSelect.js.map