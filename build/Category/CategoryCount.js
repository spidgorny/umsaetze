"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Backbone = require("backbone");
require("../Util/Object");
const InvalidArgumentException_1 = require("../Exception/InvalidArgumentException");
const _ = __importStar(require("underscore"));
const type = require('get-type');
class CategoryCount extends Backbone.Model {
    constructor(...args) {
        super();
        if (!args[0] || !('catName' in args[0])) {
            throw new InvalidArgumentException_1.InvalidArgumentException('CategoryCount needs parameters');
        }
        if (_.isObject(args[0].catName)) {
            for (let key in args[0].catName) {
                this.set(key, args[0].catName[key]);
            }
            args[0].catName = args[0].catName.name;
        }
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
        if (type.isObject(this.catName)) {
            const bankData = this.catName;
            Object.assign(this, bankData);
            this.catName = bankData.name;
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
        let catName = this.get('catName');
        if (_.isObject(catName)) {
            catName = catName.name;
        }
        return catName;
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
    getAmountFloat() {
        return this.get('amount');
    }
}
CategoryCount.DEFAULT = 'Default';
exports.default = CategoryCount;
//# sourceMappingURL=CategoryCount.js.map