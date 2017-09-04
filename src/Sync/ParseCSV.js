"use strict";
/// <reference path="../../typings/index.d.ts" />
exports.__esModule = true;
// import {start} from "repl";
var Number_1 = require("../Util/Number");
var Papa = require('papaparse');
var Table_1 = require("./Table");
var Row_1 = require("./Row");
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
var ParseCSV = /** @class */ (function () {
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
        this.data = null; // save RAM
        console.log('rows after parse', csv.length);
        csv = csv.trim();
        // csv = csv.trimAll(); // prevents analyzeCSV from working
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
     * Some CSV files contain random data in the header
     * @public for tests
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
        return new Table_1["default"](sliced);
    };
    /**
     * We got pure data with headers here
     */
    ParseCSV.prototype.normalizeCSV = function (data) {
        //console.log(data);
        var typeSet = data.getRowTypesForSomeRows();
        typeSet = typeSet.filterMostlyNull();
        // console.log(typeSet, 'typeSet');
        var aCommon = typeSet.mode();
        var common = new Row_1["default"](aCommon);
        console.log(JSON.stringify(common), 'common');
        data = common.filterByCommon(data);
        console.log('rows after filterByCommon', data.length);
        var dataWithHeader = new Table_1["default"]();
        data.forEach(function (row, i) {
            var header = common.getHeaderFromTypes(row, i);
            if (i == 0) {
                Row_1["default"].peek(row, common);
                console.log(JSON.stringify(header), 'header');
            }
            dataWithHeader.push(header);
        });
        //console.log(dataWithHeader[0], 'dataWithHeader line 0');
        return dataWithHeader;
    };
    /**
     * http://stackoverflow.com/questions/1117916/merge-keys-array-and-values-array-into-an-object-in-javascript
     * @param names
     * @param values
     * @returns Row
     */
    ParseCSV.prototype.zip = function (names, values) {
        var result = new Row_1["default"]();
        for (var i = 0; i < names.length; i++) {
            result[names[i]] = values[i];
        }
        return result;
    };
    ParseCSV.prototype.convertDataTypes = function (csv) {
        csv.forEach(function (row, i) {
            if (row.amount) {
                row.amount = Number_1.detectFloat(row.amount);
                var date = Date.parseExact(row.date, 'dd.MM.yyyy');
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
                //console.warn('convertDataTypes', row);
                delete csv[i];
            }
        });
        return csv;
    };
    return ParseCSV;
}());
exports["default"] = ParseCSV;
