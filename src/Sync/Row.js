"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('underscore');
var Row = (function (_super) {
    __extends(Row, _super);
    function Row(rawData) {
        _super.call(this);
        _.extend(this, rawData);
    }
    Row.prototype.getRowTypes = function () {
        var types = [];
        this.forEach(function (el) {
            var float = parseFloat(el);
            var date = Date.parse(el);
            var isDate = !!date && el.indexOf(',') == -1; // dates are without ","
            var commas = el.split(',').length - 1;
            var isEmpty = _.isNull(el)
                || _.isUndefined(el)
                || el == '';
            if (float && !isDate && commas == 1) {
                types.push('number');
            }
            else if (isDate) {
                types.push('date');
            }
            else if (isEmpty) {
                types.push('null');
            }
            else {
                types.push('string');
            }
        });
        return types;
    };
    Row.prototype.forEach = function (callback) {
        _super.prototype.forEach.call(this, function (row, i) {
            if (_.isNumber(i)) {
                callback(row, i);
            }
        });
    };
    return Row;
}(Array));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Row;
//# sourceMappingURL=Row.js.map