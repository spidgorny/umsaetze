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
import Transaction from './Transaction';
import { debug } from '../main';
import MonthSelect from '../MonthSelect';
import FakeJQueryXHR from '../FakeJQueryXHR';
import Backbone from 'backbone-es6/src/Backbone.js';
import { _ } from 'underscore';
var Expenses = (function (_super) {
    __extends(Expenses, _super);
    function Expenses(models, options) {
        var _this = _super.call(this, models, options) || this;
        _this.localStorage = new Backbone.LocalStorage("Expenses");
        _this.listenTo(_this, 'change', function () {
            console.log('Expenses changed event');
            _this.saveAll();
        });
        _this.on("all", debug("Expenses"));
        return _this;
    }
    Expenses.prototype.comparator = function (compare, to) {
        return compare.date == to.date
            ? 0 : (compare.date > to.date ? 1 : -1);
    };
    Expenses.prototype.fetch = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var models = this.localStorage.findAll();
        console.log('models from LS', models.length);
        if (models.length) {
            _.each(models, function (el) {
                _this.add(new Transaction(el));
            });
            this.trigger('change');
        }
        console.log('read', this.length);
        return new FakeJQueryXHR();
    };
    Expenses.prototype.getDateFrom = function () {
        var visible = this.getVisible();
        var min = new Date().addYears(10).valueOf();
        _.each(visible, function (row) {
            var date = row.getDate().valueOf();
            if (date < min) {
                min = date;
            }
        });
        return new Date(min);
    };
    Expenses.prototype.getDateTill = function () {
        var visible = this.getVisible();
        var min = new Date('1970-01-01').valueOf();
        _.each(visible, function (row) {
            var date = row.getDate().valueOf();
            if (date > min) {
                min = date;
            }
        });
        return new Date(min);
    };
    Expenses.prototype.getEarliest = function () {
        if (!this.size()) {
            return new Date();
        }
        var min = new Date().addYears(10).valueOf();
        this.each(function (row) {
            var dDate = row.getDate();
            var date = dDate.valueOf();
            if (date < min) {
                min = date;
            }
        });
        return new Date(min);
    };
    Expenses.prototype.getLatest = function () {
        if (!this.size()) {
            return new Date();
        }
        var min = new Date('1970-01-01').valueOf();
        this.each(function (row) {
            var date = row.getDate().valueOf();
            if (date > min) {
                min = date;
            }
        });
        return new Date(min);
    };
    Expenses.prototype.setAllVisible = function () {
        this.each(function (model) {
            model.set('visible', true, { silent: true });
        });
    };
    Expenses.prototype.filterVisible = function (q) {
        if (!q.length)
            return;
        console.profile('Expense.filterVisible');
        var lowQ = q.toLowerCase();
        this.each(function (row) {
            if (row.get('note').toLowerCase().indexOf(lowQ) == -1) {
                row.set('visible', false, { silent: true });
            }
        });
        console.profileEnd();
        this.saveAll();
    };
    Expenses.prototype.filterByMonth = function (selectedMonth) {
        console.profile('Expense.filterByMonth');
        if (selectedMonth) {
            this.selectedMonth = selectedMonth;
        }
        else if (this.selectedMonth) {
            selectedMonth = this.selectedMonth;
        }
        else {
            var ms = MonthSelect.getInstance();
            selectedMonth = ms.getSelected();
        }
        console.log('filterMyMonth', selectedMonth);
        if (selectedMonth) {
            var inThisMonth = this.whereMonth(selectedMonth);
            var allOthers = _.difference(this.models, inThisMonth);
            allOthers.forEach(function (row) {
                row.set('visible', false, { silent: true });
            });
            this.saveAll();
        }
        console.profileEnd('Expense.filterByMonth');
    };
    Expenses.prototype.whereMonth = function (selectedMonth) {
        var filtered = [];
        this.each(function (row) {
            var tDate = row.get('date');
            var sameYear = tDate.getFullYear() == selectedMonth.getFullYear();
            var sameMonth = tDate.getMonth() == selectedMonth.getMonth();
            if (sameYear && sameMonth) {
                filtered.push(row);
            }
        });
        return filtered;
    };
    Expenses.prototype.filterByCategory = function (category) {
        console.profile('Expense.filterByCategory');
        this.each(function (row) {
            if (row.isVisible()) {
                var rowCat = row.get('category');
                var isVisible = category.getName() == rowCat;
                row.set('visible', isVisible, { silent: true });
            }
        });
        this.saveAll();
        console.profileEnd('Expense.filterByCategory');
    };
    Expenses.prototype.saveAll = function () {
        var _this = this;
        console.profile('Expense.saveAll');
        this.localStorage._clear();
        this.each(function (model) {
            _this.localStorage.update(model);
        });
        console.profileEnd('Expense.saveAll');
    };
    Expenses.prototype.unserializeDate = function () {
        console.profile('Expense.unserializeDate');
        this.each(function (model) {
            var sDate = model.get('date');
            var dateObject = new Date(sDate);
            console.log(sDate, dateObject);
            model.set('date', dateObject);
        });
        console.profileEnd('Expense.unserializeDate');
    };
    Expenses.prototype.getVisible = function () {
        return this.where({ visible: true });
    };
    Expenses.prototype.getVisibleCount = function () {
        return this.getVisible().length;
    };
    Expenses.prototype.getSorted = function () {
        this.sort();
        var visible = this.getVisible();
        return visible;
    };
    Expenses.prototype.setCategories = function (keywords) {
        this.each(function (row) {
            if (row.get('category') == 'Default') {
                keywords.each(function (key) {
                    var note = row.get('note');
                    if (note.indexOf(key.word) > -1) {
                        console.log(note, 'contains', key.word, 'gets', key.category);
                        row.set('category', key.category, { silent: true });
                    }
                });
            }
        });
        this.trigger('change');
    };
    Expenses.prototype.getMonthlyTotalsFor = function (category) {
        var sparks = {};
        var from = this.getEarliest().moveToFirstDayOfMonth();
        var till = this.getLatest().moveToLastDayOfMonth();
        var count = 0;
        var _loop_1 = function (month) {
            var month1 = month.clone();
            month1.addMonths(1).add({ minutes: -1 });
            var sum = 0;
            this_1.each(function (transaction) {
                var sameCategory = transaction.get('category') == category.getName();
                var sameMonth = transaction.getDate().between(month, month1);
                if (sameCategory && sameMonth) {
                    sum += transaction.getAmount();
                    count++;
                    category.incrementCount();
                }
            });
            sparks[month.toString('yyyy-MM')] = Math.abs(sum).toFixed(2);
        };
        var this_1 = this;
        for (var month = from; month.compareTo(till) == -1; month.addMonths(1)) {
            _loop_1(month);
        }
        category.set('count', count, { silent: true });
        return sparks;
    };
    Expenses.prototype.replaceCategory = function (oldName, newName) {
        this.each(function (transaction) {
            if (transaction.get('category') == oldName) {
                transaction.set('category', newName, { silent: true });
            }
        });
    };
    Expenses.prototype.clear = function () {
        this.reset(null);
    };
    Expenses.prototype.map = function (fn) {
        return _.map(this.models, fn);
    };
    Expenses.prototype.stepBackTillSalary = function (ms) {
        var selectedMonth = ms.getSelected();
        if (selectedMonth) {
            var selectedMonthMinus1 = selectedMonth.clone().addMonths(-1);
            var prevMonth = this.whereMonth(selectedMonthMinus1);
            var max_1 = _.reduce(prevMonth, function (acc, row) {
                return Math.max(acc, row.get('amount'));
            }, 0);
            var doAppend_1 = false;
            prevMonth.forEach(function (row) {
                if (row.get('amount') == max_1) {
                    doAppend_1 = true;
                }
                if (doAppend_1) {
                    row.set('visible', true, { silent: true });
                }
            });
        }
    };
    return Expenses;
}(Backbone.Collection));
export default Expenses;
//# sourceMappingURL=Expenses.js.map