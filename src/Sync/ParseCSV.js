/// <reference path="../../typings/index.d.ts" />
"use strict";
var Papa = require('papaparse');
var Table_1 = require('./Table');
var Row_1 = require('./Row');
require('datejs');
/**
 * http://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
 * @param array
 * @returns {boolean}
 */
/*Array.prototype.equals = function( array ) {
    return this.length == array.length &&
        this.every( function(this_i,i) { return this_i == array[i] } )
};
*/
var ParseCSV = (function () {
    function ParseCSV(data) {
        this.data = data;
    }
    ParseCSV.prototype.parseAndNormalize = function () {
        var csv;
        if (typeof document == "this code is commented") {
            var csvObj = Papa.parse(this.data, {
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
        this.data = null; // save RAM
        console.log('rows after parse', csv.length);
        csv = this.trim(csv);
        console.log('rows after trim', csv.length);
        csv = this.analyzeCSV(csv);
        console.log('rows after analyze', csv.length);
        csv = this.normalizeCSV(csv);
        console.log('rows after normalize', csv.length);
        csv = this.convertDataTypes(csv);
        console.log('rows after convertDataTypes', csv.length);
        return csv;
    };
    /**
     * Remove empty lines from the bottom of the file.
     * This is required for analyzeCSV() to work.
     * @param csv
     * @returns {Row[]}
     */
    ParseCSV.prototype.trim = function (csv) {
        var rev = csv.reverse(); // start at the bottom of the file
        var startIndex = null;
        rev.forEach(function (row, i) {
            // first row with real data
            if (startIndex == null
                && row.length && row[0] != '') {
                startIndex = i;
                console.log('trim @', startIndex);
            }
        });
        var data = rev.slice(startIndex);
        // console.log(data[0]);
        data = data.reverse();
        return new Table_1.default(data);
    };
    /**
     * Some CSV files contain random data in the header
     */
    ParseCSV.prototype.analyzeCSV = function (data) {
        // console.log('last row', data[data.length-1]);
        var startIndex = 0;
        data.forEach(function (row, i) {
            if (!row.length || (row.length == 1 && row[0] == '')) {
                startIndex = i + 1;
            }
        });
        console.log('slicing ', startIndex, 'first rows');
        var sliced = data.slice(startIndex);
        return new Table_1.default(sliced);
    };
    /**
     * We got pure data with headers here
     */
    ParseCSV.prototype.normalizeCSV = function (data) {
        var _this = this;
        //console.log(data);
        var typeSet = data.getRowTypesForSomeRows();
        typeSet = typeSet.filterMostlyNull();
        // console.log(typeSet, 'typeSet');
        var common = typeSet.mode();
        console.log(JSON.stringify(common), 'common');
        // console.log(typeSet.length, 'typeSet.length');
        // console.log(typeSet[0], 'typeSet[0]');
        // console.log(data[0], 'data[0]');
        if (typeSet.length
            && !typeSet[0].equals(common)) {
            // first row is a header
            data = data.slice(1); // remove header
        }
        var header = this.getHeaderFromTypes(common);
        console.log(JSON.stringify(header), 'header');
        var dataWithHeader = new Table_1.default();
        data.forEach(function (row) {
            dataWithHeader.push(_this.zip(header, row));
        });
        console.log(dataWithHeader[0], 'dataWithHeader');
        return dataWithHeader;
    };
    ParseCSV.prototype.getHeaderFromTypes = function (common) {
        var header = [];
        common.forEach(function (el, i) {
            if (el == 'date' && header.indexOf('date') == -1) {
                header.push('date');
            }
            else if (el == 'number' && header.indexOf('amount') == -1) {
                header.push('amount');
            }
            else if (el == 'string' && header.indexOf('note') == -1) {
                header.push('note');
            }
            else {
                header.push('col_' + i);
            }
        });
        return header;
    };
    /**
     * http://stackoverflow.com/questions/1117916/merge-keys-array-and-values-array-into-an-object-in-javascript
     * @param names
     * @param values
     * @returns Row
     */
    ParseCSV.prototype.zip = function (names, values) {
        var result = new Row_1.default();
        for (var i = 0; i < names.length; i++) {
            result[names[i]] = values[i];
        }
        return result;
    };
    ParseCSV.prototype.convertDataTypes = function (csv) {
        csv.forEach(function (row, i) {
            if (row.amount) {
                var amount = row.amount.replace(',', '.');
                row.amount = parseFloat(amount); // german format
                row.date = Date.parseExact(row.date, 'dd.MM.yyyy');
            }
            else {
                //console.warn('convertDataTypes', row);
                delete csv[i];
            }
        });
        return csv;
    };
    return ParseCSV;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParseCSV;
//# sourceMappingURL=ParseCSV.js.map