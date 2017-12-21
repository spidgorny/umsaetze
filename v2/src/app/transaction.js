"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Transaction = /** @class */ (function () {
    function Transaction(json, categories) {
        this.id = json.id;
        this.date = new Date(json.date);
        this.amount = parseFloat(json.amount);
        this.category = json.category || 'Default';
        this.note = json.note;
        this.categories = categories;
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
    Object.defineProperty(Transaction.prototype, "cssClass", {
        get: function () {
            return this.category == 'Default'
                ? 'bg-warning' : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "background", {
        get: function () {
            return this.categories.getColorFor(this.category);
        },
        enumerable: true,
        configurable: true
    });
    Transaction.prototype.save = function () {
    };
    Transaction.prototype.isMonth = function (value) {
        var nextMonth = value.addMonths(1);
        return this.getDate() > value && this.getDate() < nextMonth;
    };
    return Transaction;
}());
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.js.map