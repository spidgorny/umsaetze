"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = require("./Transaction");
const Backbone = require("backbone");
const MonthSelect_1 = require("../MonthSelect");
const backbone_localstorage_1 = require("backbone.localstorage");
const _ = require("underscore");
class Expenses extends Backbone.Collection {
    constructor(models, options) {
        super(models, options);
        this.comparator = Expenses.comparatorFunction;
        this.localStorage = new backbone_localstorage_1.LocalStorage("Expenses");
        this.listenTo(this, 'change', () => {
            console.log('Expenses changed event');
            this.saveAll();
        });
        this.on("all", () => {
            console.log("Expenses");
        });
    }
    static comparatorFunction(compare, to) {
        return compare.date == to.date
            ? 0 : (compare.date > to.date ? 1 : -1);
    }
    fetch(options = {}) {
        let models = this.localStorage.findAll();
        console.log('models from LS', models.length);
        if (models.length) {
            _.each(models, (el) => {
                this.add(new Transaction_1.default(el));
            });
            this.trigger('change');
        }
        console.log('read', this.length);
        return {};
    }
    getDateFrom() {
        let visible = this.getVisible();
        let min = new Date().addYears(10).valueOf();
        _.each(visible, (row) => {
            let date = row.getDate().valueOf();
            if (date < min) {
                min = date;
            }
        });
        return new Date(min);
    }
    getDateTill() {
        let visible = this.getVisible();
        let min = new Date('1970-01-01').valueOf();
        _.each(visible, (row) => {
            let date = row.getDate().valueOf();
            if (date > min) {
                min = date;
            }
        });
        return new Date(min);
    }
    getEarliest() {
        if (!this.size()) {
            return new Date();
        }
        let min = new Date().addYears(10).valueOf();
        this.each((row) => {
            let dDate = row.getDate();
            let date = dDate.valueOf();
            if (date < min) {
                min = date;
            }
        });
        return new Date(min);
    }
    getLatest() {
        if (!this.size()) {
            return new Date();
        }
        let min = new Date('1970-01-01').valueOf();
        this.each((row) => {
            let date = row.getDate().valueOf();
            if (date > min) {
                min = date;
            }
        });
        return new Date(min);
    }
    setAllVisible() {
        this.each((model) => {
            model.set('visible', true, { silent: true });
        });
    }
    filterVisible(q) {
        if (!q.length)
            return;
        console.profile('Expense.filterVisible');
        let lowQ = q.toLowerCase();
        this.each((row) => {
            if (row.get('note').toLowerCase().indexOf(lowQ) == -1) {
                row.set('visible', false, { silent: true });
            }
        });
        console.profileEnd();
        this.saveAll();
    }
    filterByMonth(selectedMonth) {
        console.profile('Expense.filterByMonth');
        if (selectedMonth) {
            this.selectedMonth = selectedMonth;
        }
        else if (this.selectedMonth) {
            selectedMonth = this.selectedMonth;
        }
        else {
            let ms = MonthSelect_1.default.getInstance();
            selectedMonth = ms.getSelected();
        }
        console.log('filterMyMonth', selectedMonth);
        if (selectedMonth) {
            let inThisMonth = this.whereMonth(selectedMonth);
            let allOthers = _.difference(this.models, inThisMonth);
            allOthers.forEach((row) => {
                row.set('visible', false, { silent: true });
            });
            this.saveAll();
        }
        console.profileEnd();
    }
    whereMonth(selectedMonth) {
        let filtered = [];
        this.each((row) => {
            let tDate = row.get('date');
            let sameYear = tDate.getFullYear() == selectedMonth.getFullYear();
            let sameMonth = tDate.getMonth() == selectedMonth.getMonth();
            if (sameYear && sameMonth) {
                filtered.push(row);
            }
        });
        return filtered;
    }
    filterByCategory(category) {
        console.profile('Expense.filterByCategory');
        this.each((row) => {
            if (row.isVisible()) {
                let rowCat = row.get('category');
                let isVisible = category.getName() == rowCat;
                row.set('visible', isVisible, { silent: true });
            }
        });
        this.saveAll();
        console.profileEnd();
    }
    saveAll() {
        console.profile('Expense.saveAll');
        this.localStorage._clear();
        this.each((model) => {
            this.localStorage.update(model);
        });
        console.profileEnd();
    }
    unserializeDate() {
        console.profile('Expense.unserializeDate');
        this.each((model) => {
            let sDate = model.get('date');
            let dateObject = new Date(sDate);
            console.log(sDate, dateObject);
            model.set('date', dateObject);
        });
        console.profileEnd();
    }
    getVisible() {
        return this.where({ visible: true });
    }
    getVisibleCount() {
        return this.getVisible().length;
    }
    getSorted() {
        this.sort();
        let visible = this.getVisible();
        return visible;
    }
    setCategories(keywords) {
        this.each((row) => {
            if (row.get('category') == 'Default') {
                keywords.each((key) => {
                    let note = row.get('note');
                    if (note.indexOf(key.word) > -1) {
                        console.log(note, 'contains', key.word, 'gets', key.category);
                        row.set('category', key.category, { silent: true });
                    }
                });
            }
        });
        this.trigger('change');
    }
    getMonthlyTotalsFor(category) {
        let sparks = {};
        let from = this.getEarliest().moveToFirstDayOfMonth();
        let till = this.getLatest().moveToLastDayOfMonth();
        let count = 0;
        for (let month = from; month.compareTo(till) == -1; month.addMonths(1)) {
            let month1 = month.clone();
            month1.addMonths(1).add({ minutes: -1 });
            let sum = 0;
            this.each((transaction) => {
                let sameCategory = transaction.get('category') == category.getName();
                let sameMonth = transaction.getDate().between(month, month1);
                if (sameCategory && sameMonth) {
                    sum += transaction.getAmount();
                    count++;
                    category.incrementCount();
                }
            });
            sparks[month.toString('yyyy-MM')] = Math.abs(sum).toFixed(2);
        }
        category.set('count', count, { silent: true });
        return sparks;
    }
    replaceCategory(oldName, newName) {
        this.each((transaction) => {
            if (transaction.get('category') == oldName) {
                transaction.set('category', newName, { silent: true });
            }
        });
    }
    clear() {
        this.reset(null);
    }
    stepBackTillSalary(ms) {
        let selectedMonth = ms.getSelected();
        if (selectedMonth) {
            let selectedMonthMinus1 = selectedMonth.clone().addMonths(-1);
            let prevMonth = this.whereMonth(selectedMonthMinus1);
            let max = _.reduce(prevMonth, (acc, row) => {
                return Math.max(acc, row.get('amount'));
            }, 0);
            let doAppend = false;
            prevMonth.forEach((row) => {
                if (row.get('amount') == max) {
                    doAppend = true;
                }
                if (doAppend) {
                    row.set('visible', true, { silent: true });
                }
            });
        }
    }
}
exports.default = Expenses;
//# sourceMappingURL=Expenses.js.map