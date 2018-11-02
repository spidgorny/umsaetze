"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TestFramework_1 = __importDefault(require("../TestFramework"));
const Totals_1 = require("../../Totals/Totals");
const ExpensesMock_1 = __importDefault(require("../../Expenses/ExpensesMock"));
class TotalsTest extends TestFramework_1.default {
    run() {
        this.testRender();
    }
    testRender() {
        const ex = new ExpensesMock_1.default();
        ex.load(__dirname + '/../../../src/test/data/umsaetze-2017-04-20.json');
        const t = new Totals_1.Totals(ex);
        t.render();
    }
}
new TotalsTest().run();
//# sourceMappingURL=TotalsTest.js.map