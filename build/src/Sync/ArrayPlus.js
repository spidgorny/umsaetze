"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("underscore");
const javascript_natural_sort_1 = require("javascript-natural-sort");
class ArrayPlus extends Array {
    constructor(rows) {
        super();
        if (rows) {
            rows.forEach((el, i) => {
                this[i] = el;
            });
        }
    }
    forEach(callback) {
        let sorted_keys = Object.keys(this).sort(javascript_natural_sort_1.default);
        for (let i = 0; i < sorted_keys.length; i++) {
            let key = sorted_keys[i];
            let row = this[key];
            if (this.isNumeric(key)) {
                let ok = callback(row, parseInt(key));
                if (ok === false) {
                    break;
                }
            }
        }
    }
    isNumeric(object) {
        let stringObject = object && object.toString();
        return !_.isArray(object) && (stringObject - parseFloat(stringObject) + 1) >= 0;
    }
    equals(array) {
        return this.length == array.length &&
            this.every(function (this_i, i) { return this_i == array[i]; });
    }
    get length() {
        let len = 0;
        for (let i in this) {
            if (this.isNumeric(i)) {
                len++;
            }
        }
        return len;
    }
    set length(len) {
        this.len = len;
    }
    mode() {
        return this.sort((a, b) => this.filter(v => v.equals(a)).length
            - this.filter(v => v.equals(b)).length).pop();
    }
}
exports.default = ArrayPlus;
//# sourceMappingURL=ArrayPlus.js.map