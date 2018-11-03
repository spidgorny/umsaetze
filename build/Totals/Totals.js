"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Expenses_1 = __importDefault(require("../Expenses/Expenses"));
const underscore_1 = __importDefault(require("underscore"));
const MonthExpenses_1 = require("../Expenses/MonthExpenses");
const CurrentMonth_1 = require("../MonthSelect/CurrentMonth");
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
        console.log(Object.keys(perMonth));
        console.log(underscore_1.default.mapObject(perMonth, (key, list) => list.length));
        const totalPlus = {};
        const totalMinus = {};
        for (const month in perMonth) {
            const date = new Date(month);
            const cm = CurrentMonth_1.CurrentMonth.fromDate(date);
            let expenses = new Expenses_1.default(perMonth[month]);
            const monthlyExpenses = new MonthExpenses_1.MonthExpenses(expenses, cm);
            totalPlus[month] = monthlyExpenses.getPositiveTotal();
            totalMinus[month] = monthlyExpenses.getNegativeTotal();
        }
        console.log(totalPlus, totalMinus);
    }
}
exports.Totals = Totals;
//# sourceMappingURL=Totals.js.map