/// <reference path="../../typings/index.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ArrayPlus_1 = require("./ArrayPlus");
var Table_1 = require("./Table");
var _ = require('underscore');
// const _isNumeric = require('underscore.isnumeric');
String.prototype.repeat = function (count) {
    var accu = '';
    for (var i = 0; i < count; i++) {
        accu += this.toString();
    }
    return accu;
};
var Row = (function (_super) {
    __extends(Row, _super);
    function Row(rawData) {
        _super.call(this, rawData);
    }
    Row.prototype.trim = function () {
        var copy = new Row();
        this.forEach(function (el, i) {
            el = (el || '').trim();
            if (el.length) {
                copy[i] = el;
            }
        });
        return copy;
    };
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
            var elWithoutEUR = (el || '').replace('EUR', '').trim();
            var onlyNumbers = /^[\-,\.\d]+$/.test(elWithoutEUR);
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
        //Row.peek(this, types);
        return new Row(types);
    };
    Row.peek = function (a, b, c) {
        console.log('-- ', a.length, b.length, c ? c.length : '');
        var maxLen = 50;
        a.forEach(function (aa, i) {
            aa = aa || '';
            var bb = b[i] || '';
            var cc = c ? c[i] || '' : '';
            aa = Row.padTo(aa, maxLen);
            bb = Row.padTo(bb, maxLen);
            cc = Row.padTo(cc, maxLen);
            console.log(aa, '\t', bb, '\t', cc);
        });
    };
    Row.padTo = function (aa, maxLen) {
        aa = aa.replace(/(?:\r\n|\r|\n)/g, ' ');
        aa = aa.substr(0, maxLen);
        var paddingLength = maxLen - aa.length;
        var padding = ' '.repeat(paddingLength);
        return aa + padding;
    };
    Row.prototype.filterByCommon = function (data) {
        var _this = this;
        var matchNumber = 0;
        var filtered = data.filter(function (row, i) {
            var rowTypes = row.getRowTypes();
            if (i + 1 == 5) {
                Row.peek(row, rowTypes, _this);
            }
            var match = rowTypes.similar(_this);
            var matchPercent = rowTypes.similarPercent(_this);
            console.log(i + 1, match, '/', _this.length, '=', matchPercent, '%', row.length);
            // let firstMatch100 = matchNumber == 0 && matchPercent == 100;
            var restMatch80 = matchPercent >= 80;
            var sameLength = row.length == _this.length;
            var bReturn = restMatch80 && sameLength;
            matchNumber += bReturn ? 1 : 0;
            return bReturn;
        });
        return new Table_1["default"](filtered);
    };
    Row.prototype.getHeaderFromTypes = function (dataRow, rowNr) {
        var header = new Row();
        var strings = [];
        this.forEach(function (el, i) {
            if (el == 'date' && !header.date) {
                header.date = dataRow[i];
            }
            else if (el == 'number' && !header.amount) {
                header.amount = dataRow[i];
            }
            else if (el == 'string') {
                strings.push(dataRow[i].trim());
            }
        });
        // http://stackoverflow.com/questions/6521245/finding-longest-string-in-array
        //let longest = strings.reduce(function (a, b) { return a.length > b.length ? a : b; });
        //header.note = longest.trim();
        header.note = strings.join(' ');
        if (!rowNr) {
        }
        return header;
    };
    Row.prototype.similar = function (to) {
        var theSame = 0;
        this.forEach(function (el, i) {
            var bb = to[i];
            theSame += el == bb ? 1 : 0;
        });
        return theSame;
    };
    Row.prototype.similarPercent = function (to) {
        var similar = this.similar(to);
        return similar / this.length * 100;
    };
    return Row;
}(ArrayPlus_1["default"]));
exports.__esModule = true;
exports["default"] = Row;
//# sourceMappingURL=Row.js.map