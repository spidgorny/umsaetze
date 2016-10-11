"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ArrayPlus_1 = require("./ArrayPlus");
var _ = require('underscore');
var _isNumeric = require('underscore.isnumeric');
var Row = (function (_super) {
    __extends(Row, _super);
    function Row(rawData) {
        _super.call(this, rawData);
    }
    Row.prototype.getRowTypes = function () {
        var types = [];
        this.forEach(function (el) {
            // console.log('getRowTypes', el);
            var float = parseFloat(el);
            var date = Date.parse(el);
            var isDate = !!date && el.indexOf(',') == -1; // dates are without ","
            var isEmpty = _.isNull(el)
                || _.isUndefined(el)
                || el == '';
            var commas = 0;
            if (_.isString(el)) {
                commas = el.split(',').length - 1;
            }
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
        return new ArrayPlus_1.default(types);
    };
    return Row;
}(ArrayPlus_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Row;
//# sourceMappingURL=Row.js.map