/// <reference path="../../typings/index.d.ts" />
"use strict";
var Papa = require('papaparse');
var Table_1 = require('./Table');
require('datejs');
/**
 * http://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
 * @param array
 * @returns {boolean}
 */
Array.prototype.equals = function (array) {
    return this.length == array.length &&
        this.every(function (this_i, i) { return this_i == array[i]; });
};
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
                comments: "#"
            });
            csv = csvObj.data;
        }
        else {
            csv = Table_1["default"].fromText(this.data);
        }
        console.log('rows after parse', csv.length);
        csv = this.trim(csv);
        console.log('rows after trim', csv.length);
        csv = this.analyzeCSV(csv);
        console.log('rows after analyze', csv.length);
        csv = this.normalizeCSV(csv);
        console.log('rows after normalize', csv.length);
        //console.log(csv);
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
        var startIndex = 0;
        rev.forEach(function (row, i) {
            // first row with real data
            if (!startIndex && row.length && row[0] != '') {
                startIndex = i;
                console.log('trim @', startIndex);
            }
        });
        csv = csv.slice(startIndex);
        return csv.reverse();
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
        data = data.slice(startIndex);
        return data;
    };
    /**
     * We got pure data with headers here
     */
    ParseCSV.prototype.normalizeCSV = function (data) {
        var _this = this;
        //console.log(data);
        var typeSet = this.getRowTypesForSomeRows(data);
        var common = this.mode(typeSet);
        console.log(common, 'common');
        //console.log(typeSet[0]);
        if (!typeSet[0].equals(common)) {
            // first row is a header
            data = data.slice(1); // remove header
        }
        var header = this.getHeaderFromTypes(common);
        console.log(header, 'header');
        var dataWithHeader = [];
        data.forEach(function (row) {
            dataWithHeader.push(_this.zip(header, row));
        });
        console.log(dataWithHeader[0]);
        return dataWithHeader;
    };
    ParseCSV.prototype.getRowTypes = function (row) {
        var types = [];
        row.forEach(function (el) {
            var float = parseFloat(el);
            var date = Date.parse(el);
            var isDate = !!date && el.indexOf(',') == -1; // dates are without ,
            if (float && !isDate) {
                types.push('number');
            }
            else if (isDate) {
                types.push('date');
            }
            else {
                types.push('string');
            }
        });
        return types;
    };
    ParseCSV.prototype.getRowTypesForSomeRows = function (data) {
        var typeSet = [];
        for (var i = 0; i < 10 && i < data.length; i++) {
            var row = data[i];
            // console.log(i, row);
            var types = this.getRowTypes(row);
            //console.log(types);
            typeSet.push(types);
        }
        return typeSet;
    };
    /**
     * http://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
     * @param arr
     * @returns {T|_ChainSingle<T>|TModel}
     */
    ParseCSV.prototype.mode = function (arr) {
        return arr.sort(function (a, b) {
            return arr.filter(function (v) { return v === a; }).length
                - arr.filter(function (v) { return v === b; }).length;
        }).pop();
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
     * @returns {{}}
     */
    ParseCSV.prototype.zip = function (names, values) {
        var result = {};
        for (var i = 0; i < names.length; i++) {
            result[names[i]] = values[i];
        }
        return result;
    };
    return ParseCSV;
}());
exports.__esModule = true;
exports["default"] = ParseCSV;
//# sourceMappingURL=ParseCSV.js.map