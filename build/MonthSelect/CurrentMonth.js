"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("datejs");
const Number_1 = require("../Util/Number");
require('../Util/Number');
class CurrentMonth {
    constructor(year, month = CurrentMonth.DEFAULT_MONTH) {
        this.earliest = new Date().moveToMonth(0, -1).moveToFirstDayOfMonth();
        this.latest = new Date();
        this._selectedYear = CurrentMonth.DEFAULT_YEAR;
        this._selectedMonth = CurrentMonth.DEFAULT_MONTH;
        this._selectedYear = year;
        this._selectedMonth = month;
    }
    static fromDate(date) {
        return new CurrentMonth(date.getFullYear(), CurrentMonth.getShortMonthNameFor(date.getMonth() + 1));
    }
    get selectedYear() {
        return this._selectedYear;
    }
    set selectedYear(value) {
        if (value < this.earliest.getFullYear()) {
            console.error('setting year smaller than max', value, this.earliest.toString('yyyy-MM-dd'));
        }
        if (value > this.latest.getFullYear()) {
            console.error('setting year bigger than max', value, this.latest.toString('yyyy-MM-dd'));
        }
        this._selectedYear = value;
    }
    get selectedMonth() {
        return this._selectedMonth;
    }
    set selectedMonth(value) {
        const withYear = new Date(this.selectedYear + '-' + value + '-01');
        if (withYear < this.earliest) {
            console.error('setting month smaller than max', withYear.toString('yyyy-MM-dd'), this.earliest.toString('yyyy-MM-dd'));
        }
        if (withYear > this.latest) {
            console.error('setting month bigger than max', withYear.toString('yyyy-MM-dd'), this.latest.toString('yyyy-MM-dd'));
        }
        this._selectedMonth = value;
    }
    getSelected() {
        let sSelectedDate = this.selectedYear + '-' + this.getMonthIndex() + '-01';
        return new Date(sSelectedDate);
    }
    setEarliest(date) {
        this.earliest = date.clone();
        this.earliest.moveToFirstDayOfMonth()
            .setUTCHours(0, 0, 0, 0);
    }
    setLatest(date) {
        this.latest = date.clone();
        this.latest.moveToLastDayOfMonth()
            .setUTCHours(0, 0, 0, 0);
    }
    getMonthIndex() {
        let result = Date.getMonthNumberFromName(this._selectedMonth) + 1;
        return result;
    }
    getMonthIndexFor(monthName) {
        let result = Date.getMonthNumberFromName(monthName) + 1;
        return result;
    }
    getMonthNameFor(index) {
        return CurrentMonth.getShortMonthNameFor(index);
    }
    static getMonthName() {
        throw new Error('getMonthName called when selectedMonth is a string already');
    }
    getShortMonthName() {
    }
    static getShortMonthNameFor(index) {
        const longName = this.monthNames[index - 1] || this.monthNames[0];
        return longName.substr(0, 3);
    }
    update(earliest, latest) {
        this.setEarliest(earliest);
        this.setLatest(latest);
        this._selectedYear = Number_1.clamp(this._selectedYear, this.earliest.getFullYear(), this.latest.getFullYear());
        let selectedMonthIndex = Number_1.clamp(this.getMonthIndex(), this.earliest.getMonth(), this.latest.getMonth());
        this._selectedMonth = this.getMonthNameFor(selectedMonthIndex);
        console.log('MonthSelect range', this.earliest.toString('yyyy-MM-dd'), this.latest.toString('yyyy-MM-dd'));
    }
    getURL() {
        let sMonth;
        let month = this.getMonthIndex();
        if (month < 10) {
            sMonth = '0' + month.toString();
        }
        else {
            sMonth = month.toString();
        }
        return '/' + this.selectedYear.toString() + '/' + sMonth;
    }
}
CurrentMonth.monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];
CurrentMonth.DEFAULT_YEAR = new Date().getFullYear();
CurrentMonth.DEFAULT_MONTH = 'Feb';
exports.CurrentMonth = CurrentMonth;
//# sourceMappingURL=CurrentMonth.js.map