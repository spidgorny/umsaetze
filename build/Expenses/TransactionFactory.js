"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = __importDefault(require("./Transaction"));
class TransactionFactory {
    constructor(expenses) {
        this.expenses = expenses;
    }
    make(attributes) {
        const t = new Transaction_1.default(attributes);
        t.expenses = this.expenses;
        t.init();
        return t;
    }
}
exports.TransactionFactory = TransactionFactory;
//# sourceMappingURL=TransactionFactory.js.map