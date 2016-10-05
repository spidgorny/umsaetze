/// <reference path="../../typings/index.d.ts" />
/// <reference path="Table.ts" />
"use strict";
var Papa = require('papaparse');
var ParseCSV = (function () {
    function ParseCSV(data) {
        this.data = data;
    }
    ParseCSV.prototype.parseAndNormalize = function () {
        var csv = Papa.parse(this.data, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            comments: "#"
        });
        console.log('rows after parse', csv.data.length);
        csv.data = this.analyzeCSV(csv.data);
        console.log('rows after analyze', csv.data.length);
        csv.data = this.normalizeCSV(csv.data);
        console.log('rows after normalize', csv.data.length);
        //console.log(csv);
        return csv.data;
    };
    /**
     * Some CSV files contain random data in the header
     */
    ParseCSV.prototype.analyzeCSV = function (data) {
        var startIndex = 0;
        data.forEach(function (row, i) {
            if (!row.length) {
                startIndex = i + 1;
            }
        });
        console.log('slicing ', startIndex, 'first rows');
        data = data.slice(startIndex);
        console.log('first row', data[0]);
        return data;
    };
    /**
     * Some CSV files contain random data in the header
     */
    ParseCSV.prototype.normalizeCSV = function (data) {
        console.log(data);
        for (var i = 0; i < 5 && i < data.length; i++) {
            var row = data[i];
            console.log(i, row);
        }
        return data;
    };
    return ParseCSV;
}());
exports.__esModule = true;
exports["default"] = ParseCSV;
//# sourceMappingURL=ParseCSV.js.map