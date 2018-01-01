"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Backbone = require("backbone");
const CategoryCount_1 = require("../Category/CategoryCount");
require("datejs");
const _ = require("underscore");
class Expenses extends Backbone.Collection {
    static comparatorFunction(compare, to) {
        return compare.getDate() == to.getDate()
            ? 0 : (compare.getDate() > to.getDate() ? 1 : -1);
    }
    constructor(models = [], options = {}, ls, tf = null) {
        super(models, options);
        this.localStorage = ls;
        this.listenTo(this, 'change', () => {
            console.log('Expenses changed event, saveAll()');
        });
        this.on("all", () => {
        });
    }
    fetch(options = {}) {
        console.time('Expenses.fetch');
        let models = this.localStorage.findAll();
        console.log('models from LS', models.length);
        if (models.length) {
            _.each(models, (el) => {
                let transaction = this.tf.make(el);
                this.add(transaction);
            });
            this.trigger('change');
        }
        console.log('read', this.length);
        console.timeEnd('Expenses.fetch');
        return {};
    }
    saveAll() {
        console.warn('Expenses.saveAll prevented');
        return;
    }
    saveReallyAll() {
        console.time('Expenses.saveAll');
        this.localStorage._clear();
        this.each((model) => {
            this.localStorage.update(model);
        });
        console.timeEnd('Expenses.saveAll');
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
        console.time('Expense.filterByMonth');
        console.log('filterByMonth', selectedMonth.toString('yyyy-MM-dd'));
        if (selectedMonth) {
            let inThisMonth = this.whereMonth(selectedMonth);
            let allOthers = _.difference(this.models, inThisMonth);
            allOthers.forEach((row) => {
                row.set('visible', false, { silent: true });
            });
        }
        console.timeEnd('Expense.filterByMonth');
    }
    whereMonth(selectedMonth) {
        let filtered = [];
        this.each((row) => {
            let tDate = row.getDate();
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
        return _(this.models).where({ visible: true });
    }
    getVisibleCount() {
        return this.getVisible().length;
    }
    getSorted() {
        let visible = this.getVisible();
        const sorted = visible.sort(this.comparator);
        return sorted;
    }
    setCategories(keywords) {
        console.group('Expenses.setCategories');
        console.log('setCategories', this.size(), keywords.size());
        let anythingChanged = false;
        this.each((row) => {
            if (row.get('category') === CategoryCount_1.default.DEFAULT) {
                let note = row.get('note');
                keywords.each((key) => {
                    let found = note.indexOf(key.word);
                    if (found > -1) {
                        row.set('category', key.category, { silent: true });
                        anythingChanged = true;
                    }
                });
            }
        });
        if (anythingChanged) {
            console.log('trigger change', this._events);
            this.trigger('change');
        }
        else {
            console.log('nothing changed');
        }
        console.groupEnd();
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