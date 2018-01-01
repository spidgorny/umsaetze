"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = require("./Transaction");
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