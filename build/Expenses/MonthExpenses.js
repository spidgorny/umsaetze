"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CategoryCount_1 = require("../Category/CategoryCount");
class MonthExpenses {
    constructor(expenses, month) {
        this.expenses = expenses;
        this.month = month;
    }
    getSorted() {
        this.expenses.setAllVisible();
        this.expenses.filterByMonth(this.month.getSelected());
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
}
exports.MonthExpenses = MonthExpenses;
//# sourceMappingURL=MonthExpenses.js.map