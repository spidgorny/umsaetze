"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TestFramework_1 = __importDefault(require("../TestFramework"));
const ExpensesMock_1 = __importDefault(require("../../Expenses/ExpensesMock"));
const Analyze_1 = require("../../Analyze");
class AnalyzeTest extends TestFramework_1.default {
    run() {
        this.testRender();
    }
    testRender() {
        const ex = new ExpensesMock_1.default();
        ex.load(__dirname + '/../../../src/test/data/withCategory.json');
        const t = new Analyze_1.Analyze(ex);
        t.render();
    }
}
new AnalyzeTest().run();
//# sourceMappingURL=AnalyzeTest.js.map