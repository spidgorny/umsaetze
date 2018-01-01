"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Backbone = require("backbone");
const md5 = require("md5");
const Workspace_1 = require("../Workspace");
const _ = require("underscore");
class Transaction extends Backbone.Model {
    constructor(attributes, options) {
        super(attributes, options);
        this.injectExpenses();
        this.defaults = {
            visible: true,
        };
        if (!this.get('id')) {
            const sDate = this.get('date');
            this.set('id', md5(sDate + this.get('amount')));
        }
        if (!this.has('visible')) {
            this.set('visible', true);
        }
        if (!this.get('category')) {
            this.set('category', 'Default');
        }
        if (!this.has('note')) {
            this.set('note', '');
        }
        if (!this.has('done')) {
            this.set('done', false);
        }
    }
    injectExpenses() {
        this.expenses = Workspace_1.default.getInstance().model;
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
        console.group('Transaction.setCategory', this.get('id'));
        console.warn('this.set', this._events);
        this.set('category', category, { silent: true });
        console.groupEnd();
    }
    getDate() {
        let dDate;
        let sDate = this.get('date');
        if (sDate instanceof Date) {
            dDate = sDate;
        }
        else {
            dDate = new Date(sDate);
            let dDateValid = !isNaN(dDate.getTime());
            if (!dDate || !dDateValid) {
                dDate = Date.parseExact(sDate, "d.M.yyyy");
            }
        }
        return dDate;
    }
    isVisible() {
        return this.get('visible');
    }
    getAmount() {
        return parseFloat(this.get('amount'));
    }
    set(field, value, options) {
        super.set(field, value, options);
        if (_.isString(field)) {
            console.log('Transaction updated: ', field, value);
            this.expenses.localStorage.update(this);
        }
        return this;
    }
}
exports.default = Transaction;
//# sourceMappingURL=Transaction.js.map