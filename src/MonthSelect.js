"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Backbone = require("backbone");
const $ = require("jquery");
class MonthSelect extends Backbone.View {
    constructor() {
        super();
        this.$el = $('#MonthSelect');
        this.yearSelect = this.$('select');
        this.monthOptions = this.$('button');
        this.selectedYear = parseInt(this.yearSelect.val() + '') || new Date().getFullYear();
        this.selectedMonth = 'Feb';
        this.earliest = new Date();
        this.latest = new Date();
        this.monthNames = [
            "January", "February", "March",
            "April", "May", "June",
            "July", "August", "September",
            "October", "November", "December"
        ];
        if (!this.storageProvider) {
            this.storageProvider = window.localStorage;
        }
        this.monthOptions.on('click', this.clickOnMonth.bind(this));
        this.yearSelect.on('change', this.changeYear.bind(this));
        let year = this.storageProvider.getItem('MonthSelect.year');
        if (year) {
            this.selectedYear = parseInt(year);
        }
        let month = this.storageProvider.getItem('MonthSelect.month');
        if (month) {
            this.selectedMonth = month;
        }
    }
    static getInstance() {
        if (!MonthSelect.instance) {
            MonthSelect.instance = new MonthSelect();
        }
        return MonthSelect.instance;
    }
    render() {
        this.earliest.moveToFirstDayOfMonth();
        let selectedDate = this.getSelected();
        let options = [];
        let minYear = this.earliest.getFullYear();
        let maxYear = this.latest.getFullYear();
        for (let y = minYear; y <= maxYear; y++) {
            let selected = selectedDate.getFullYear() == y ? 'selected' : '';
            options.push('<option ' + selected + '>' + y + '</option>');
        }
        this.yearSelect.html(options.join("\n"));
        this.monthOptions.each((i, button) => {
            let monthNumber = i + 1;
            let sDate = this.selectedYear + '-' + monthNumber + '-01';
            let firstOfMonth = new Date(sDate);
            let $button = $(button);
            let isAfter = firstOfMonth.isAfter(this.earliest);
            let isBefore = firstOfMonth.isBefore(this.latest);
            if (isAfter && isBefore) {
                $button.removeAttr('disabled');
            }
            else {
                $button.attr('disabled', 'disabled');
            }
            let equals = firstOfMonth.equals(selectedDate);
            if (equals) {
                $button.addClass('btn-success').removeClass('btn-default');
            }
            else {
                $button.removeClass('btn-success').addClass('btn-default');
            }
        });
        return this;
    }
    show() {
        this.$el.show();
        this.render();
    }
    hide() {
        console.error('MonthSelect.hide');
        this.$el.hide();
    }
    getMonthIndex() {
        let result = Date.getMonthNumberFromName(this.selectedMonth) + 1;
        return result;
    }
    getMonthIndexFor(monthName) {
        let result = Date.getMonthNumberFromName(monthName) + 1;
        return result;
    }
    getMonthNameFor(index) {
        return this.getShortMonthNameFor(index);
    }
    changeYear(event) {
        Backbone.history.navigate('#/' + this.yearSelect.val() + '/' + this.getMonthIndex());
    }
    clickOnMonthAndNavigate(event) {
        this.monthOptions.removeClass('btn-success').addClass('btn-default');
        let $button = $(event.target);
        $button.removeClass('btn-default');
        $button.addClass('btn-success');
        let monthIndex = this.getMonthIndexFor($button.text());
        Backbone.history.navigate('#/' + this.selectedYear + '/' + monthIndex);
    }
    clickOnMonth(event) {
        this.monthOptions.removeClass('btn-success').addClass('btn-default');
        let $button = $(event.target);
        $button.removeClass('btn-default');
        $button.addClass('btn-success');
        this.selectedMonth = $button.text();
        this.storageProvider.setItem('MonthSelect.month', this.selectedMonth);
        this.trigger('MonthSelect:change');
    }
    setYear(year) {
        console.log('setYear', year);
        this.selectedYear = year;
        this.storageProvider.setItem('MonthSelect.year', this.selectedYear + '');
        this.render();
        this.trigger('MonthSelect:change');
    }
    setMonth(month) {
        let monthName = this.getMonthNameFor(month);
        console.log('setMonth', month);
        this.selectedMonth = monthName;
        this.storageProvider.setItem('MonthSelect.month', this.selectedMonth);
        this.trigger('MonthSelect:change');
    }
    setYearMonth(year, month) {
        console.log('setYearMonth', year, month);
        this.selectedYear = year;
        this.storageProvider.setItem('MonthSelect.year', this.selectedYear.toString());
        this.selectedMonth = this.getMonthNameFor(month);
        this.storageProvider.setItem('MonthSelect.month', this.selectedMonth);
        this.render();
        this.trigger('MonthSelect:change');
    }
    trigger(what) {
        console.warn(what);
        super.trigger(what);
    }
    getSelected() {
        let sSelectedDate = this.selectedYear + '-' + this.getMonthIndex() + '-01';
        let selectedDate = new Date(sSelectedDate);
        return selectedDate;
    }
    static getMonthName() {
        throw new Error('getMonthName called when selectedMonth is a string already');
    }
    getShortMonthName() {
    }
    getShortMonthNameFor(index) {
        return this.monthNames[index - 1].substr(0, 3);
    }
    update(collection) {
        this.earliest = collection.getEarliest();
        this.latest = collection.getLatest();
        this.selectedYear = this.selectedYear.clamp(this.earliest.getFullYear(), this.latest.getFullYear());
        let selectedMonthIndex = this.getMonthIndex().clamp(this.earliest.getMonth(), this.latest.getMonth());
        this.selectedMonth = this.getShortMonthNameFor(selectedMonthIndex);
        this.show();
    }
}
exports.default = MonthSelect;
//# sourceMappingURL=MonthSelect.js.map