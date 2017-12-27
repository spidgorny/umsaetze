"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Category = /** @class */ (function () {
    function Category(props) {
        this.count = 0;
        this.amount = 0;
        this.totalCount = 0;
        this.totalAmount = 0;
        this.color = Category.pastelColor();
        this.total = 1;
        this.name = props.name;
        this.count = props.count || 0;
        this.amount = props.amount || 0;
        this.color = props.color || Category.pastelColor();
    }
    Category.pastelColor = function () {
        var r = (Math.round(Math.random() * 55) + 200).toString(16);
        var g = (Math.round(Math.random() * 55) + 200).toString(16);
        var b = (Math.round(Math.random() * 55) + 200).toString(16);
        return '#' + r + g + b;
    };
    Object.defineProperty(Category.prototype, "money", {
        get: function () {
            return (this.amount).toFixed(2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Category.prototype, "sign", {
        get: function () {
            return this.amount >= 0 ? 'positive' : 'negative';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Category.prototype, "width", {
        get: function () {
            return Math.abs(this.amount / this.total * 100).toFixed(2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Category.prototype, "average", {
        get: function () {
            return this.amount / this.count;
        },
        enumerable: true,
        configurable: true
    });
    Category.prototype.values = function (object) {
        return Object.keys(object).map(function (key) { return object[key]; });
    };
    Category.prototype.getAverageAmountPerMonth = function (totalsPerMonth) {
        var totals = this.values(totalsPerMonth);
        var sum = totals.reduce(function (a, b) {
            return parseFloat(a) + parseFloat(b);
        });
        return sum / totals.length;
    };
    return Category;
}());
exports.Category = Category;
//# sourceMappingURL=category.js.map