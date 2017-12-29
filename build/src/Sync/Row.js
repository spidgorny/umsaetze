"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayPlus_1 = require("../Util/ArrayPlus");
const Table_1 = require("./Table");
const _ = require("underscore");
require("../Util/String");
const Number_1 = require("../Util/Number");
class Row extends ArrayPlus_1.default {
    constructor(rawData) {
        super(rawData);
    }
    trim() {
        let copy = new Row();
        this.forEach((el, i) => {
            el = (el || '').trim();
            if (el.length) {
                copy[i] = el;
            }
        });
        return copy;
    }
    getRowTypes() {
        let types = [];
        this.forEach((el) => {
            let float = Number_1.detectFloat(el);
            let date = Date.parse(el);
            let isDate = !!date && el.indexOf(',') == -1;
            let isEmpty = _.isNull(el)
                || _.isUndefined(el)
                || el == '';
            let commas = 0;
            if (_.isString(el)) {
                commas = el.split(',').length - 1;
            }
            let elWithoutEUR = (el || '').replace('EUR', '').trim();
            let onlyNumbers = /^[\-,\.\d]+$/.test(elWithoutEUR);
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
        return new Row(types);
    }
    static peek(a, b, c) {
        console.log('-- ', a.length, b.length, c ? c.length : '');
        let maxLen = 50;
        a.forEach((aa, i) => {
            aa = aa || '';
            let bb = b[i] || '';
            let cc = c ? c[i] || '' : '';
            aa = Row.padTo(aa, maxLen);
            bb = Row.padTo(bb, maxLen);
            cc = Row.padTo(cc, maxLen);
            console.log(aa, '\t', bb, '\t', cc);
        });
    }
    static padTo(aa, maxLen) {
        aa = aa.replace(/(?:\r\n|\r|\n)/g, ' ');
        aa = aa.substr(0, maxLen);
        let paddingLength = maxLen - aa.length;
        let padding = ' '.repeat(paddingLength);
        return aa + padding;
    }
    filterByCommon(data) {
        let matchNumber = 0;
        let filtered = data.filter((row, i) => {
            let rowTypes = row.getRowTypes();
            if (i + 1 == 5) {
                Row.peek(row, rowTypes, this);
            }
            let match = rowTypes.similar(this);
            let matchPercent = rowTypes.similarPercent(this);
            console.log(i + 1, match, '/', this.length, '=', matchPercent, '%', row.length);
            let restMatch80 = matchPercent >= 80;
            let sameLength = row.length == this.length;
            let bReturn = restMatch80 && sameLength;
            matchNumber += bReturn ? 1 : 0;
            return bReturn;
        });
        return new Table_1.default(filtered);
    }
    getHeaderFromTypes(dataRow, rowNr) {
        let header = new Row();
        let strings = [];
        this.forEach((el, i) => {
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
        header.note = strings.join(' ');
        if (!rowNr) {
        }
        return header;
    }
    similar(to) {
        let theSame = 0;
        this.forEach((el, i) => {
            let bb = to[i];
            theSame += el == bb ? 1 : 0;
        });
        return theSame;
    }
    similarPercent(to) {
        let similar = this.similar(to);
        return similar / this.length * 100;
    }
    toVanilla() {
        return JSON.parse(JSON.stringify(this));
    }
}
exports.default = Row;
//# sourceMappingURL=Row.js.map