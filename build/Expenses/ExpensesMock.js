"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Expenses_1 = __importDefault(require("./Expenses"));
const Transaction_1 = __importDefault(require("./Transaction"));
const MockStorage_1 = __importDefault(require("../Util/MockStorage"));
const fs = require('fs');
class ExpensesMock extends Expenses_1.default {
    constructor(tf) {
        super([], {}, new MockStorage_1.default(), tf);
        this.models = [];
    }
    load(file) {
        let json = fs.readFileSync(file);
        let data = JSON.parse(json);
        data.forEach(row => {
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
}
exports.default = ExpensesMock;
//# sourceMappingURL=ExpensesMock.js.map