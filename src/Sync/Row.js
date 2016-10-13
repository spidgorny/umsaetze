"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ArrayPlus_1 = require("./ArrayPlus");
var Table_1 = require("./Table");
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
            var onlyNumbers = /^[\-,\.\d]+$/.test(el);
            if (float && !isDate && commas == 1 && onlyNumbers) {
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
        // this.peek(this, types);
        return new ArrayPlus_1.default(types);
    };
    Row.prototype.peek = function (a, b) {
        console.log('-- ', a.length, b.length);
        var maxLen = 50;
        a.forEach(function (aa, i) {
            aa = aa || '';
            var bb = b[i] || '';
            aa = aa.substr(0, maxLen);
            bb = bb.substr(0, maxLen);
            var paddingLength = maxLen - aa.length;
            var padding = ' '.repeat(paddingLength);
            console.log(aa, padding, '\t', bb);
        });
    };
    Row.prototype.filterByCommon = function (data) {
        var _this = this;
        var filtered = data.filter(function (row) {
            var rowTypes = row.getRowTypes();
            return rowTypes.equals(_this);
        });
        return new Table_1.default(filtered);
    };
    Row.prototype.getHeaderFromTypes = function (dataRow) {
        var header = new Row();
        var strings = [];
        this.forEach(function (el, i) {
            if (el == 'date' && header.indexOf('date') == -1) {
                header.date = dataRow[i];
            }
            else if (el == 'number' && header.indexOf('amount') == -1) {
                header.amount = dataRow[i];
            }
            else if (el == 'string' && header.indexOf('note') == -1) {
                strings.push(dataRow[i]);
            }
        });
        // http://stackoverflow.com/questions/6521245/finding-longest-string-in-array
        var longest = strings.reduce(function (a, b) { return a.length > b.length ? a : b; });
        header.note = longest;
        return header;
    };
    return Row;
}(ArrayPlus_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Row;
//# sourceMappingURL=Row.js.map