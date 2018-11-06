"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TestFramework_1 = __importDefault(require("../TestFramework"));
const Totals_1 = require("../../Totals/Totals");
const ExpensesMock_1 = __importDefault(require("../../Expenses/ExpensesMock"));
const Expenses_1 = __importDefault(require("../../Expenses/Expenses"));
const Transaction_1 = __importDefault(require("../../Expenses/Transaction"));
class TotalsTest extends TestFramework_1.default {
    run() {
        this.testExpensesUnset();
        this.testRender();
    }
    loadFromCSVandSave() {
        const ex = new ExpensesMock_1.default();
        console.log('Loading json...');
        ex.load(__dirname + '/../../../src/test/data/umsaetze-2017-04-20.json');
        console.log('Loading csv...');
        ex.loadCSV(__dirname + '/../../../src/test/data/umsaetze-1090729-2018-10-07-18-42-43.csv');
        console.log('Saving...');
        ex.saveJSON(__dirname + '/../../../src/test/data/2017-2018.json');
    }
    loadFromCSVandSave2() {
        const ex = new ExpensesMock_1.default();
        console.log('Loading csv...');
        ex.loadCSV(__dirname + '/../../../src/test/data/umsaetze-1090729-2018-11-06-13-43-57.csv');
        console.log('Saving...');
        ex.saveJSON(__dirname + '/../../../src/test/data/2017-2018.json');
    }
    testRender() {
        const ex = new ExpensesMock_1.default();
        ex.load(__dirname + '/../../../src/test/data/2017-2018.json');
        const t = new Totals_1.Totals(ex);
        t.render();
    }
    testExpensesUnset() {
        const e = new Expenses_1.default();
        const t = new Transaction_1.default({
            amount: 10,
        });
        e.add(t);
        this.assert(e.size() == 1);
        e.remove(t);
        this.assert(e.size() == 0);
    }
}
new TotalsTest().run();
//# sourceMappingURL=TotalsTest.js.map