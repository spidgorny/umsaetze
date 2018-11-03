"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Row_1 = __importDefault(require("./Row"));
const ArrayPlus_1 = __importDefault(require("../Util/ArrayPlus"));
class Table extends ArrayPlus_1.default {
    constructor(rows) {
        super();
        if (typeof rows === 'object') {
            rows.forEach((el, i) => {
                this[i] = new Row_1.default(el);
            });
        }
    }
    log(...line) {
        if (this.logger) {
            this.logger.log(line);
        }
    }
    static fromText(text) {
        let self = new Table();
        let lines = self.tryBestSeparator(text);
        lines.forEach((row, i) => {
            self.push(row);
        });
        return self;
    }
    tryBestSeparator(text) {
        let linesC = Table.CSVToArray(text, ',');
        let linesS = Table.CSVToArray(text, ';');
        let colsC = [];
        let colsS = [];
        for (let i = 0; i < 100 && i < linesC.length && i < linesS.length; i++) {
            colsC.push(linesC[i].length);
            colsS.push(linesS[i].length);
        }
        let sumC = colsC.reduce(function (a, b) {
            return a + b;
        });
        let sumS = colsS.reduce(function (a, b) {
            return a + b;
        });
        this.log(', => ', sumC, '; => ', sumS);
        let lines;
        if (sumC > sumS) {
            lines = linesC;
        }
        else {
            lines = linesS;
        }
        return lines;
    }
    static CSVToArray(strData, strDelimiter) {
        strDelimiter = (strDelimiter || ",");
        let objPattern = new RegExp(("(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
        let arrData = [[]];
        let arrMatches = null;
        while (arrMatches = objPattern.exec(strData)) {
            let strMatchedDelimiter = arrMatches[1];
            if (strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter) {
                arrData.push([]);
            }
            let strMatchedValue;
            if (arrMatches[2]) {
                strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
            }
            else {
                strMatchedValue = arrMatches[3];
            }
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        return (arrData);
    }
    trim() {
        let rev = this.reverse();
        let startIndex = null;
        rev.forEach((row, i) => {
            if (startIndex == null
                && row.length && row[0] != '') {
                startIndex = i;
                this.log('trim @', startIndex);
            }
        });
        let data = rev.slice(startIndex);
        this.log('trim()', rev.length, startIndex, data.length);
        data = data.reverse();
        return new Table(data);
    }
    trimAll() {
        let data = new Table();
        this.forEach((row, i) => {
            let rowObj = new Row_1.default(row);
            let rowTrimmed = rowObj.trim();
            if (rowTrimmed.length) {
                data.push(rowObj);
            }
        });
        return data;
    }
    getRowTypesForSomeRows() {
        let typeSet = new Table();
        this.log('getRowTypesForSomeRows', this.length);
        let iter = 0;
        this.forEach((row0, i) => {
            let row = new Row_1.default(row0);
            let types = row.getRowTypes();
            typeSet.push(types);
            iter++;
            if (iter > 100) {
                return false;
            }
        });
        return typeSet;
    }
    filterMostlyNull() {
        let notNull = this.filter((row) => {
            let countNull = row.filter(type => {
                return type == 'null';
            }).length;
            return countNull < row.length / 2;
        });
        return new Table(notNull);
    }
    toVanilla() {
        let copy = [];
        this.forEach(row => {
            copy.push(row.toVanilla());
        });
        return copy;
    }
    toVanillaTable() {
        let copy = [];
        this.forEach(row => {
            copy.push(Object.values(row.toVanilla()));
        });
        return copy;
    }
}
exports.default = Table;
//# sourceMappingURL=Table.js.map