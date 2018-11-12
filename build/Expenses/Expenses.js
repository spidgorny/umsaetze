"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("datejs");
const underscore_1 = __importDefault(require("underscore"));
const jquery_1 = __importDefault(require("jquery"));
const Backbone = require("backbone");
class Expenses extends Backbone.Collection {
    constructor(models = [], options = {}, ls, tf = null) {
        super(models, options);
        this.counter = 0;
        this.lastPercent = 0;
        if (ls) {
            this.localStorage = ls;
        }
        else if (typeof window !== 'undefined') {
            this.localStorage = window.localStorage;
        }
        this.listenTo(this, 'change', () => {
            console.log('Expenses changed event, saveAll()');
        });
        this.on("all", () => {
        });
        this.comparator = Expenses.comparatorFunction;
    }
    static comparatorFunction(compare, to) {
        return compare.getDate() == to.getDate()
            ? 0 : (compare.getDate() > to.getDate() ? 1 : -1);
    }
    fetch(options = {}) {
        console.time('Expenses.fetch');
        let models = this.localStorage.findAll();
        console.log('models from LS', models.length);
        if (models.length) {
            underscore_1.default.each(models, (el) => {
                let transaction = this.tf.make(el);
                this.add(transaction, {
                    silent: true,
                });
            });
            console.log('added objects', this.size());
        }
        console.log('read', this.length);
        console.timeEnd('Expenses.fetch');
        return {};
    }
    asyncFetch(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            console.time('Expenses.asyncFetch');
            let models = this.localStorage.findAll();
            console.log('models from LS', models.length);
            jquery_1.default('#app').html(`<div class="progress" id="progress">
  <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">
    0%
  </div>
</div>`);
            if (models.length) {
                const promList = [];
                for (let el of models) {
                    promList.push(this.addElementUpdateProgress(el, models.length));
                }
                console.log('await Promise.all...');
                yield Promise.all(promList);
                console.log('added objects', this.size());
            }
            console.log('read', this.length);
            console.timeEnd('Expenses.asyncFetch');
        });
    }
    sleep(fn, par) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(fn(par)), 0);
        });
    }
    addElementUpdateProgress(el, numModels) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sleep(() => {
                let transaction = this.tf.make(el);
                this.add(transaction);
                const percent = Math.round(this.counter++ / numModels * 100);
                if (percent > this.lastPercent + 5) {
                    jquery_1.default('#app #progress .progress-bar')
                        .width(percent + '%')
                        .text(percent + '%');
                    this.lastPercent = percent;
                }
            });
        });
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
        underscore_1.default.each(visible, (row) => {
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
        underscore_1.default.each(visible, (row) => {
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
            model.visible = true;
        });
    }
    filterVisible(q) {
        if (!q.length)
            return;
        console.time('Expenses.filterVisible');
        let lowQ = q.toLowerCase();
        this.each((row) => {
            if (row.get('note').toLowerCase().indexOf(lowQ) == -1) {
                row.set('visible', false, { silent: true });
            }
        });
        console.timeEnd('Expenses.filterVisible');
    }
    filterByMonth(selectedMonth) {
        if (selectedMonth) {
            let inThisMonth = this.whereMonth(selectedMonth);
            let allOthers = underscore_1.default.difference(this.models, inThisMonth);
            allOthers.forEach((row) => {
                row.set('visible', false, { silent: true });
            });
        }
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
        console.time('Expenses.filterByCategory');
        this.each((row) => {
            if (row.isVisible()) {
                let rowCat = row.get('category');
                let isVisible = category.getName() == rowCat;
                row.set('visible', isVisible, { silent: true });
            }
        });
        this.saveAll();
        console.timeEnd('Expenses.filterByCategory');
    }
    unserializeDate() {
        console.time('Expenses.unserializeDate');
        this.each((model) => {
            let sDate = model.get('date');
            let dateObject = new Date(sDate);
            console.log(sDate, dateObject);
            model.set('date', dateObject);
        });
        console.timeEnd('Expenses.unserializeDate');
    }
    getVisible() {
        return underscore_1.default(this.models).where({ visible: true });
    }
    getVisibleCount() {
        return this.getVisible().length;
    }
    getSorted() {
        let visible = this.getVisible();
        const sorted = visible.sort(this.comparator);
        return sorted;
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
            let max = underscore_1.default.reduce(prevMonth, (acc, row) => {
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
    groupByMonth() {
        const perMonth = {};
        let from = this.getEarliest().moveToFirstDayOfMonth();
        let till = this.getLatest().moveToLastDayOfMonth();
        for (let month = from.clone(); month.compareTo(till) == -1; month.addMonths(1)) {
            let month1 = month.clone();
            month1.addMonths(1).add({ minutes: -1 });
            this.each((transaction) => {
                let sameMonth = transaction.getDate().between(month, month1);
                if (sameMonth) {
                    const key = month.getFullYear() + '-' + (month.getMonth() + 1).toString().padStart(2, '0');
                    if (!(key in perMonth)) {
                        perMonth[key] = [];
                    }
                    perMonth[key].push(transaction);
                }
            });
        }
        return perMonth;
    }
}
exports.default = Expenses;
//# sourceMappingURL=Expenses.js.map