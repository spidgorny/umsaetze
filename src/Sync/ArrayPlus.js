"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('underscore');
var javascript_natural_sort_1 = require('javascript-natural-sort');
var ArrayPlus = (function (_super) {
    __extends(ArrayPlus, _super);
    function ArrayPlus(rows) {
        var _this = this;
        _super.call(this);
        if (rows) {
            //console.log('ArrayPlus', rows.length);
            rows.forEach(function (el, i) {
                _this[i] = el;
            });
        }
    }
    /**
     * @param callback
     */
    ArrayPlus.prototype.forEach = function (callback) {
        // super.forEach((row, i) => {
        var sorted_keys = Object.keys(this).sort(javascript_natural_sort_1.default);
        for (var i = 0; i < sorted_keys.length; i++) {
            var key = sorted_keys[i];
            var row = this[key];
            if (this.isNumeric(key)) {
                var ok = callback(row, parseInt(key));
                if (ok === false) {
                    break;
                }
            }
        }
    };
    ArrayPlus.prototype.isNumeric = function (object) {
        var stringObject = object && object.toString();
        return !_.isArray(object) && (stringObject - parseFloat(stringObject) + 1) >= 0;
    };
    ArrayPlus.prototype.equals = function (array) {
        return this.length == array.length &&
            this.every(function (this_i, i) { return this_i == array[i]; });
    };
    Object.defineProperty(ArrayPlus.prototype, "length", {
        get: function () {
            var len = 0;
            for (var i in this) {
                if (this.isNumeric(i)) {
                    len++;
                }
            }
            return len;
        },
        set: function (len) {
            this.len = len;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * http://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
     * @param arr
     * @returns {T|_ChainSingle<T>|TModel}
     */
    ArrayPlus.prototype.mode = function () {
        var _this = this;
        return this.sort(function (a, b) {
            return _this.filter(function (v) { return v.equals(a); }).length
                - _this.filter(function (v) { return v.equals(b); }).length;
        }).pop();
    };
    return ArrayPlus;
}(Array));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArrayPlus;
