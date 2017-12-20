"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Transaction = /** @class */ (function () {
    function Transaction(json) {
        this.id = json.id;
        this.date = new Date(json.date);
        this.amount = parseFloat(json.amount);
        this.category = json.category || 'Default';
        this.note = json.note;
    }
    Object.defineProperty(Transaction.prototype, "sign", {
        get: function () {
            return this.amount >= 0 ? 'positive' : 'negative';
        },
        enumerable: true,
        configurable: true
    });
    Transaction.prototype.getDate = function () {
        return this.date;
    };
    return Transaction;
}());
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.js.map