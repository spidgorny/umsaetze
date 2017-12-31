"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Backbone = require("backbone");
const md5 = require("md5");
class Transaction extends Backbone.Model {
    constructor(attributes, options) {
        super(attributes, options);
        this.defaults = {
            visible: true,
        };
        let dDate;
        let sDate = this.get('date');
        if (sDate instanceof Date) {
            dDate = sDate.clone();
            sDate = dDate.toString('d.M.yyyy');
        }
        else {
            dDate = new Date(sDate);
            let dDateValid = !isNaN(dDate.getTime());
            if (!dDate || !dDateValid) {
                dDate = Date.parseExact(sDate, "d.M.yyyy");
            }
            this.set('date', dDate);
        }
        if (!this.get('id')) {
            this.set('id', md5(sDate + this.get('amount')));
        }
        this.set('amount', parseFloat(this.get('amount')));
        if (!this.has('visible')) {
            this.set('visible', true);
        }
        this.set('category', this.get('category') || 'Default');
        this.set('note', this.get('note'));
        this.set('done', this.get('done'));
    }
    sign() {
        return this.get('amount') >= 0 ? 'positive' : 'negative';
    }
    toJSON() {
        let json = super.toJSON();
        json.sign = this.sign();
        json.id = this.id;
        return json;
    }
    setCategory(category) {
        console.group('Transaction.setCategory');
        console.warn('this.set', this._events);
        this.set('category', category);
        this.collection.localStorage.update(this);
        console.groupEnd();
    }
    getDate() {
        let date = this.get('date');
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return date;
    }
    isVisible() {
        return this.get('visible');
    }
    getAmount() {
        return this.get('amount');
    }
}
exports.default = Transaction;
//# sourceMappingURL=Transaction.js.map