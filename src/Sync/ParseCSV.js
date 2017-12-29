"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Number_1 = require("../Util/Number");
const papaparse_1 = require("papaparse");
const Table_1 = require("./Table");
const Row_1 = require("./Row");
require("datejs");
class ParseCSV {
    constructor(data) {
        this.data = data;
    }
    parseAndNormalize() {
        let csv;
        if (typeof document == "boolean") {
            let csvObj = papaparse_1.default.parse(this.data, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                comments: "#",
            });
            csv = csvObj.data;
        }
        else {
            csv = Table_1.default.fromText(this.data);
        }
        this.data = null;
        console.log('rows after parse', csv.length);
        csv = csv.trim();
        console.log('rows after trim', csv.length);
        csv = this.analyzeCSV(csv);
        console.log('rows after analyze', csv.length);
        csv = this.normalizeCSV(csv);
        console.log('rows after normalize', csv.length);
        csv = this.convertDataTypes(csv);
        console.log('rows after convertDataTypes', csv.length);
        return csv;
    }
    analyzeCSV(data) {
        let startIndex = 0;
        data.forEach((row, i) => {
            if (!row.length || (row.length == 1 && row[0] == '')) {
                startIndex = i + 1;
            }
        });
        console.log('slicing ', startIndex, 'first rows');
        let sliced = data.slice(startIndex);
        return new Table_1.default(sliced);
    }
    normalizeCSV(data) {
        let typeSet = data.getRowTypesForSomeRows();
        typeSet = typeSet.filterMostlyNull();
        let aCommon = typeSet.mode();
        let common = new Row_1.default(aCommon);
        console.log(JSON.stringify(common), 'common');
        data = common.filterByCommon(data);
        console.log('rows after filterByCommon', data.length);
        let dataWithHeader = new Table_1.default();
        data.forEach((row, i) => {
            let header = common.getHeaderFromTypes(row, i);
            if (i == 0) {
                Row_1.default.peek(row, common);
                console.log(JSON.stringify(header), 'header');
            }
            dataWithHeader.push(header);
        });
        return dataWithHeader;
    }
    zip(names, values) {
        let result = new Row_1.default();
        for (let i = 0; i < names.length; i++) {
            result[names[i]] = values[i];
        }
        return result;
    }
    convertDataTypes(csv) {
        csv.forEach((row, i) => {
            if (row.amount) {
                row.amount = Number_1.detectFloat(row.amount);
                let date = Date.parseExact(row.date, 'dd.MM.yyyy');
                if (!date) {
                    date = Date.parseExact(row.date, 'dd.MM.yy');
                    if (!date) {
                        console.warn('Date parse error', row.date, date);
                    }
                }
                if (date) {
                    row.date = date;
                }
            }
            else {
                delete csv[i];
            }
        });
        return csv;
    }
}
exports.default = ParseCSV;
//# sourceMappingURL=ParseCSV.js.map