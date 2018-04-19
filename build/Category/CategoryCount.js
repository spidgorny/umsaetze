"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Backbone = require("backbone");
require("../Util/Object");
class CategoryCount extends Backbone.Model {
    constructor(...args) {
        super();
        this.set('catName', args[0].catName);
        this.set('color', args[0].color);
        this.set('count', args[0].count);
        this.set('amount', args[0].amount);
        this.set('id', args[0].id);
        let color = this.get('color');
        if (!color) {
            this.set('color', this.pastelColor());
        }
        let count = this.get('count');
        if (!count) {
            this.set('count', 0);
        }
        let amount = this.get('amount');
        if (!amount) {
            this.set('amount', 0);
        }
    }
    setColor(color) {
        this.set('color', color);
    }
    pastelColor() {
        let r = (Math.round(Math.random() * 55) + 200).toString(16);
        let g = (Math.round(Math.random() * 55) + 200).toString(16);
        let b = (Math.round(Math.random() * 55) + 200).toString(16);
        return '#' + r + g + b;
    }
    getName() {
        return this.get('catName');
    }
    getAmount() {
        return this.get('amount').toFixed(2);
    }
    resetCounters() {
        this.set('count', 0, { silent: true });
    }
    incrementCount() {
        this.set('count', this.get('count') + 1, { silent: true });
    }
    incrementAmountBy(by) {
        this.set('amount', this.get('amount') + by, { silent: true });
    }
    getAverageAmountPerMonth(totalsPerMonth) {
        let totals = Object.values(totalsPerMonth);
        let sum = totals.reduce(function (a, b) { return parseFloat(a) + parseFloat(b); });
        let avg = sum / totals.length;
        return avg.toFixed(2);
    }
}
CategoryCount.DEFAULT = 'Default';
exports.default = CategoryCount;
//# sourceMappingURL=CategoryCount.js.map