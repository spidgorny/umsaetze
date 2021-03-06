"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Backbone = require("backbone");
const md5_1 = __importDefault(require("md5"));
const _ = __importStar(require("underscore"));
class Transaction extends Backbone.Model {
    constructor(attributes, options) {
        super(attributes, options);
        this.visible = true;
    }
    init() {
        this.defaults = {
            visible: true,
        };
        if (!this.get('id')) {
            const sDate = this.get('date');
            this.set('id', md5_1.default(sDate + this.get('amount')));
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
        if (!this.cacheDate) {
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
            this.cacheDate = dDate;
        }
        return this.cacheDate;
    }
    isVisible() {
        return this.get('visible');
    }
    getAmount() {
        return parseFloat(this.get('amount'));
    }
    get(field) {
        if (field === 'visible') {
            return this.visible;
        }
        else {
            const value = super.get(field);
            if (field == 'category' && _.isObject(value)) {
                return value.name;
            }
            return value;
        }
    }
    set(field, value, options) {
        if (field === 'visible') {
            this.visible = value;
        }
        else {
            super.set(field, value, options);
            if (_.isString(field)) {
                console.log('Transaction updated: ', field, value);
                this.expenses.localStorage.update(this);
            }
        }
        return this;
    }
    contains(substr) {
        return this.get('note').toString().includes(substr);
    }
}
exports.default = Transaction;
//# sourceMappingURL=Transaction.js.map