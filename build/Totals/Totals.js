"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Expenses_1 = __importDefault(require("../Expenses/Expenses"));
const underscore_1 = __importDefault(require("underscore"));
const MonthExpenses_1 = require("../Expenses/MonthExpenses");
const CurrentMonth_1 = require("../MonthSelect/CurrentMonth");
const easy_table_1 = __importDefault(require("easy-table"));
class Totals {
    constructor(expenses) {
        this.visible = false;
        this.expenses = expenses;
    }
    show() {
        this.visible = true;
        this.render();
    }
    hide() {
        this.visible = false;
    }
    render() {
        console.time('groupByMonth');
        const perMonth = this.expenses.groupByMonth();
        console.timeEnd('groupByMonth');
        console.log(underscore_1.default.mapObject(perMonth, (list, key) => {
            return list.length;
        }));
        const totalPlus = new Map();
        const totalMinus = new Map();
        for (const month in perMonth) {
            const date = new Date(month);
            const cm = CurrentMonth_1.CurrentMonth.fromDate(date);
            let expenses = new Expenses_1.default(perMonth[month]);
            const monthlyExpenses = new MonthExpenses_1.MonthExpenses(expenses, cm);
            monthlyExpenses.filter(this.filterOutliers.bind(this));
            totalPlus[month] = monthlyExpenses.getPositiveTotal();
            totalMinus[month] = monthlyExpenses.getNegativeTotal();
        }
        console.log(this.makeTable(totalPlus, totalMinus));
    }
    makeTable(totalPlus, totalMinus) {
        const t = new easy_table_1.default();
        let runningTotal = 0;
        Object.keys(totalPlus).map((month) => {
            const plus = totalPlus[month];
            const minus = totalMinus[month];
            t.cell('Month', month);
            t.cell('Income', plus.toFixed(2));
            t.cell('Expenses', minus.toFixed(2));
            t.cell('Remaining', (plus + minus).toFixed(2));
            runningTotal += (plus + minus);
            t.cell('Cumulative', runningTotal.toFixed(2));
            t.newRow();
        });
        return t.toString();
    }
    filterOutliers(tr) {
        if (tr.getAmount() > 500) {
            if (!tr.contains('Nintendo')) {
                return false;
            }
        }
        if (tr.getAmount() < -500) {
            return false;
        }
        return true;
    }
}
exports.Totals = Totals;
//# sourceMappingURL=Totals.js.map