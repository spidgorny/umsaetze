"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var category_list_1 = require("../services/category-list");
var ExpensesBase = /** @class */ (function () {
    function ExpensesBase(loader, saver) {
        this.loader = loader;
        this.saver = saver;
        // console.log('ExpensesService', this.loader.data.length);
        // this.saver.expenses = this.loader.expenses;
    }
    Object.defineProperty(ExpensesBase.prototype, "data", {
        get: function () {
            // console.log('loader expenses', this.loader.expenses.length);
            return this.loader.data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExpensesBase.prototype, "size", {
        /**
         *
         * @returns {number}
         */
        get: function () {
            return this.loader.data.length;
        },
        enumerable: true,
        configurable: true
    });
    ExpensesBase.prototype.getEarliest = function () {
        if (!this.size) {
            return new Date();
        }
        var min = new Date().addYears(10).valueOf();
        this.data.forEach(function (row) {
            var dDate = row.getDate();
            var date = dDate.valueOf();
            if (date < min) {
                min = date;
            }
        });
        return new Date(min);
    };
    ExpensesBase.prototype.getLatest = function () {
        if (!this.size) {
            return new Date();
        }
        var min = new Date('1970-01-01').valueOf();
        this.data.forEach(function (row) {
            var date = row.getDate().valueOf();
            if (date > min) {
                min = date;
            }
        });
        return new Date(min);
    };
    ExpensesBase.prototype.save = function (tr) {
        this.saver.save(tr);
    };
    ExpensesBase.prototype.filterByMonth = function (value) {
        value.setDate(1); // make the beginning of the month
        return this.data.filter(function (tr) {
            return tr.isMonth(value);
        });
    };
    ExpensesBase.prototype.getVisible = function (curMonth) {
        return this.filterByMonth(curMonth.getValue());
    };
    ExpensesBase.prototype.getTotal = function (visible) {
        return visible.reduce(function (acc, tr) {
            if (tr.category !== category_list_1.CategoryList.INCOME) {
                return acc + Math.abs(tr.amount);
            }
            return acc;
        }, 0).toFixed(2);
    };
    ExpensesBase.prototype.filterByCategory = function (category) {
        return this.data.filter(function (tr) {
            return tr.category === category.name;
        });
    };
    ExpensesBase.prototype.getMonths = function () {
        var months = [];
        var from = this.getEarliest().moveToFirstDayOfMonth();
        var till = this.getLatest().moveToLastDayOfMonth();
        // console.log({
        // 	from: from.toString('yyyy-MM-dd HH:mm'),
        // 	till: till.toString('yyyy-MM-dd HH:mm'),
        // });
        for (var month = from; month.compareTo(till) === -1; month.addMonths(1)) {
            var copy = month.clone();
            months.push(copy);
        }
        return months;
    };
    ExpensesBase.prototype.getMonthPairs = function () {
        return this.getMonths().map(function (month) {
            var next = month.clone();
            next.addMonths(1).add({ seconds: -1 });
            return {
                month: month,
                next: next,
            };
        });
    };
    ExpensesBase.prototype.getMonthlyTotalsFor = function (category) {
        var categoryData = this.filterByCategory(category);
        var sparks = {};
        this.getMonthPairs().forEach(function (pair) {
            // console.log({
            // 	month: month.toString('yyyy-MM-dd HH:mm'),
            // 	month1: month1.toString('yyyy-MM-dd HH:mm'),
            // 	today_is_between: Date.today().between(month, month1)
            // });
            var sum = 0;
            categoryData.forEach(function (transaction) {
                var sameMonth = transaction.getDate()
                    .between(pair.month, pair.next);
                if (sameMonth) {
                    sum += transaction.amount;
                    // count++;
                    // category.incrementAmountBy(transaction.getAmount());	// spoils CategoryView
                }
            });
            var key = pair.month.toString('yyyy-MM');
            sparks[key] = Math.abs(sum).toFixed(2);
        });
        // console.log(category.getName(), count);
        return sparks;
    };
    return ExpensesBase;
}());
exports.ExpensesBase = ExpensesBase;
//# sourceMappingURL=expenses-base.js.map