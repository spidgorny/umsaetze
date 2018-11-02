"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CategoryCount_1 = __importDefault(require("../Category/CategoryCount"));
const log = require('ololog');
class MonthExpenses {
    constructor(expenses, month) {
        this.category = null;
        this.expenses = expenses;
        this.month = month;
    }
    setCategory(cat) {
        this.category = cat;
    }
    getSorted() {
        this.expenses.setAllVisible();
        this.expenses.filterByMonth(this.month.getSelected());
        if (this.category) {
            this.expenses.filterByCategory(this.category);
        }
        return this.expenses.getSorted();
    }
    size() {
        return this.getSorted().length;
    }
    getDateFrom() {
        this.getSorted();
        return this.expenses.getDateFrom();
    }
    getDateTill() {
        this.getSorted();
        return this.expenses.getDateTill();
    }
    saveAll() {
        this.expenses.saveAll();
    }
    getVisibleCount() {
        return this.size();
    }
    get(id) {
        return this.expenses.get(id);
    }
    remove(id, options) {
        return this.expenses.remove(id, options);
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
                    if (key.word == 'SVYETOSLAV PIDGORNYY') {
                        log(note.length, key.word, found);
                    }
                    if (found > -1) {
                        row.set('category', key.category, { silent: true });
                        anythingChanged = true;
                    }
                });
            }
        });
        if (anythingChanged) {
            console.log('trigger change', this.expenses._events);
            this.trigger('change');
        }
        else {
            console.log('nothing changed');
        }
        console.groupEnd();
    }
    each(cb) {
        for (let el of this.getSorted()) {
            cb(el);
        }
    }
    trigger(event) {
        this.expenses.trigger(event);
    }
    reduce(callback, init = null) {
    }
    getTotal() {
        let total = 0;
        this.expenses.each(transaction => {
            const amount = transaction.getAmount();
            total += amount;
        });
        return total;
    }
    getPositiveTotal() {
        let total = 0;
        this.expenses.each(transaction => {
            const amount = transaction.getAmount();
            if (amount > 0) {
                total += amount;
            }
        });
        return total;
    }
    getNegativeTotal() {
        let total = 0;
        this.expenses.each(transaction => {
            const amount = transaction.getAmount();
            if (amount < 0) {
                total += amount;
            }
        });
        return total;
    }
}
exports.MonthExpenses = MonthExpenses;
//# sourceMappingURL=MonthExpenses.js.map