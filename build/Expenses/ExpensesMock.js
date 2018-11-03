"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Expenses_1 = __importDefault(require("./Expenses"));
const Transaction_1 = __importDefault(require("./Transaction"));
const MockStorage_1 = __importDefault(require("../Util/MockStorage"));
const ParseCSV_1 = __importDefault(require("../Sync/ParseCSV"));
const Logger_1 = require("../Sync/Logger");
const fs = require('fs');
class ExpensesMock extends Expenses_1.default {
    constructor(tf) {
        super([], {}, new MockStorage_1.default(), tf);
        this.models = [];
    }
    load(file) {
        let json = fs.readFileSync(file);
        let data = JSON.parse(json);
        this.addAll(data);
    }
    addAll(rows) {
        rows.forEach(row => {
            this.models.push(new Transaction_1.default(row));
        });
    }
    size() {
        return this.models.length;
    }
    each(cb) {
        return this.models.forEach((value, index) => cb(value, index));
    }
    dumpVisible() {
        let content = [];
        this.each((model) => {
            content.push(model.get('visible') ? '+' : '-');
        });
        console.log('visible', content.join(''));
    }
    loadCSV(file) {
        let data = fs.readFileSync(file);
        let parser = new ParseCSV_1.default(data);
        parser.logger = new Logger_1.Logger((line) => {
        });
        parser.progress = (step, much) => {
            console.log(step, much);
        };
        let csv = parser.parseAndNormalize();
        this.addAll(csv);
    }
    saveJSON(file) {
        fs.writeFileSync(file, JSON.stringify(this.models, null, '\t'));
    }
}
exports.default = ExpensesMock;
//# sourceMappingURL=ExpensesMock.js.map