"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Row_1 = require("./Row");
var ArrayPlus_1 = require("./ArrayPlus");
var _ = require('underscore');
var Table = (function (_super) {
    __extends(Table, _super);
    function Table(rows) {
        var _this = this;
        _super.call(this);
        if (rows) {
            //console.log('ArrayPlus', rows.length);
            rows.forEach(function (el, i) {
                _this[i] = new Row_1.default(el);
            });
        }
    }
    Table.fromText = function (text) {
        var self = new Table();
        var lines = self.tryBestSeparator(text);
        lines.forEach(function (row, i) {
            self.push(row);
        });
        return self;
    };
    Table.prototype.tryBestSeparator = function (text) {
        var linesC = Table.CSVToArray(text, ',');
        var linesS = Table.CSVToArray(text, ';');
        var colsC = [];
        var colsS = [];
        for (var i = 0; i < 100 && i < linesC.length && i < linesS.length; i++) {
            colsC.push(linesC[i].length);
            colsS.push(linesS[i].length);
        }
        // console.log(colsC, colsS);
        var sumC = colsC.reduce(function (a, b) { return a + b; });
        var sumS = colsS.reduce(function (a, b) { return a + b; });
        console.log(', => ', sumC, '; => ', sumS);
        var lines;
        if (sumC > sumS) {
            lines = linesC;
        }
        else {
            lines = linesS;
        }
        return lines;
    };
    /**
     * http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
     * @param strData
     * @param strDelimiter
     * @returns {Array[]}
     * @constructor
     */
    Table.CSVToArray = function (strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");
        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp((
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];
        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;
        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];
            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter) {
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }
            var strMatchedValue = void 0;
            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
            }
            else {
                // We found a non-quoted value.
                strMatchedValue = arrMatches[3];
            }
            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        // Return the parsed data.
        return (arrData);
    };
    /**
     * Remove empty lines from the bottom of the file.
     * This is required for analyzeCSV() to work.
     * @returns {Row[]}
     */
    Table.prototype.trim = function () {
        var rev = this.reverse(); // start at the bottom of the file
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
        return new Table(data);
    };
    /**
     * Remove empty lines from anywhere in the file.
     * This is required for analyzeCSV() to work.
     * @returns {Row[]}
     */
    Table.prototype.trimAll = function () {
        var data = new Table();
        this.forEach(function (row, i) {
            var rowObj = new Row_1.default(row);
            var rowTrimmed = rowObj.trim();
            if (rowTrimmed.length) {
                data.push(rowObj); // original non trimmed row
            }
        });
        return data;
    };
    Table.prototype.getRowTypesForSomeRows = function () {
        var typeSet = new Table();
        console.log('getRowTypesForSomeRows', this.length);
        var iter = 0;
        this.forEach(function (row0, i) {
            var row = new Row_1.default(row0);
            var types = row.getRowTypes();
            //console.log(i, row, types);
            typeSet.push(types);
            iter++;
            if (iter > 100) {
                return false;
            }
        });
        return typeSet;
    };
    Table.prototype.filterMostlyNull = function () {
        var notNull = this.filter(function (row) {
            var countNull = row.filter(function (type) {
                return type == 'null';
            }).length;
            // console.log(countNull, row);
            return countNull < row.length / 2;
        });
        return new Table(notNull);
    };
    return Table;
}(ArrayPlus_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Table;
