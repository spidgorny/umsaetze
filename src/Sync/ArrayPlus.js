var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { _ } from 'underscore';
import naturalSort from 'javascript-natural-sort';
var ArrayPlus = (function (_super) {
    __extends(ArrayPlus, _super);
    function ArrayPlus(rows) {
        var _this = _super.call(this) || this;
        if (rows) {
            rows.forEach(function (el, i) {
                _this[i] = el;
            });
        }
        return _this;
    }
    ArrayPlus.prototype.forEach = function (callback) {
        var sorted_keys = Object.keys(this).sort(naturalSort);
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
    ArrayPlus.prototype.mode = function () {
        var _this = this;
        return this.sort(function (a, b) {
            return _this.filter(function (v) { return v.equals(a); }).length
                - _this.filter(function (v) { return v.equals(b); }).length;
        }).pop();
    };
    return ArrayPlus;
}(Array));
export default ArrayPlus;
//# sourceMappingURL=ArrayPlus.js.map