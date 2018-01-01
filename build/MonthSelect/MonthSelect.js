"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Backbone = require("backbone");
const $ = require("jquery");
const CurrentMonth_1 = require("./CurrentMonth");
class MonthSelect extends Backbone.View {
    constructor() {
        super();
        this.$el = $('#MonthSelect');
        this.yearSelect = this.$('select');
        this.monthOptions = this.$('button');
        this.currentMonth = new CurrentMonth_1.CurrentMonth(parseInt(this.yearSelect.val() + '') || CurrentMonth_1.CurrentMonth.DEFAULT_YEAR);
        if (!this.storageProvider) {
            this.storageProvider = window.localStorage;
        }
        this.monthOptions
            .off('click')
            .on('click', this.clickOnMonth.bind(this));
        this.yearSelect
            .off('change')
            .on('change', this.changeYear.bind(this));
        let year = this.storageProvider.getItem('MonthSelect.year');
        if (year) {
            this.currentMonth.selectedYear = parseInt(year);
        }
        let month = this.storageProvider.getItem('MonthSelect.month');
        if (month) {
            this.currentMonth.selectedMonth = month;
        }
    }
    static getInstance() {
        if (!MonthSelect.instance) {
            MonthSelect.instance = new MonthSelect();
        }
        return MonthSelect.instance;
    }
    render() {
        let selectedDate = this.getSelected();
        let options = [];
        let minYear = this.currentMonth.earliest.getFullYear();
        let maxYear = this.currentMonth.latest.getFullYear();
        for (let y = minYear; y <= maxYear; y++) {
            let selected = selectedDate.getFullYear() == y ? 'selected' : '';
            options.push('<option ' + selected + '>' + y + '</option>');
        }
        this.yearSelect.html(options.join("\n"));
        this.monthOptions.each((i, button) => {
            let monthNumber = i + 1;
            let sDate = this.currentMonth.selectedYear + '-' + monthNumber + '-01';
            let firstOfMonth = new Date(sDate);
            let $button = $(button);
            let isAfter = firstOfMonth.isAfter(this.currentMonth.earliest);
            let isBefore = firstOfMonth.isBefore(this.currentMonth.latest);
            let isTheSame = firstOfMonth.equals(this.currentMonth.earliest);
            if ((isAfter && isBefore) || isTheSame) {
                $button.removeAttr('disabled');
            }
            else {
                console.log('disable month', monthNumber, isAfter, isBefore, isTheSame, firstOfMonth.toString('yyyy-MM-dd'), this.currentMonth.earliest.toString('yyyy-MM-dd'), firstOfMonth, this.currentMonth.earliest);
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
    changeYear(event) {
        Backbone.history.navigate('#/' + this.yearSelect.val() + '/' + this.currentMonth.getMonthIndex());
    }
    clickOnMonthAndNavigate(event) {
        this.monthOptions.removeClass('btn-success').addClass('btn-default');
        let $button = $(event.target);
        $button.removeClass('btn-default');
        $button.addClass('btn-success');
        let monthIndex = this.currentMonth.getMonthIndexFor($button.text());
        Backbone.history.navigate('#/' + this.currentMonth.selectedYear + '/' + monthIndex);
    }
    clickOnMonth(event) {
        this.monthOptions.removeClass('btn-success').addClass('btn-default');
        let $button = $(event.target);
        $button.removeClass('btn-default');
        $button.addClass('btn-success');
        this.currentMonth.selectedMonth = $button.text();
        this.storageProvider.setItem('MonthSelect.month', this.currentMonth.selectedMonth);
        this.storageProvider.setItem('MonthSelect.year', this.currentMonth.selectedYear + '');
        this.trigger('MonthSelect:change');
    }
    setYear(year) {
        console.log('setYear', year);
        this.currentMonth.selectedYear = year;
        this.storageProvider.setItem('MonthSelect.year', this.currentMonth.selectedYear + '');
        this.render();
        this.trigger('MonthSelect:change');
    }
    setMonth(month) {
        let monthName = this.currentMonth.getMonthNameFor(month);
        console.log('setMonth', month);
        this.currentMonth.selectedMonth = monthName;
        this.storageProvider.setItem('MonthSelect.month', this.currentMonth.selectedMonth);
        this.trigger('MonthSelect:change');
    }
    setYearMonth(year, month) {
        console.log('setYearMonth', year, month);
        this.currentMonth.selectedYear = year;
        this.storageProvider.setItem('MonthSelect.year', this.currentMonth.selectedYear.toString());
        this.currentMonth.selectedMonth = this.currentMonth.getMonthNameFor(month);
        this.storageProvider.setItem('MonthSelect.month', this.currentMonth.selectedMonth);
        this.render();
        this.trigger('MonthSelect:change');
    }
    trigger(what) {
        console.warn(what);
        super.trigger(what);
    }
    getSelected() {
        return this.currentMonth.getSelected();
    }
    update(collection) {
        this.currentMonth.update(collection.getEarliest(), collection.getLatest());
        this.show();
    }
}
exports.default = MonthSelect;
//# sourceMappingURL=MonthSelect.js.map