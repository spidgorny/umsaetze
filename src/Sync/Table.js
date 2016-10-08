"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Row = (function () {
    function Row() {
    }
    return Row;
}());
var Table = (function (_super) {
    __extends(Table, _super);
    function Table() {
        _super.apply(this, arguments);
    }
    Table.fromText = function (text) {
        var self = new Table();
        var lines = Table.CSVToArray(text, ';');
        lines.forEach(function (row, i) {
            self.push(row);
        });
        return self;
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
    Table.prototype.equals = function (array) {
        return this.length == array.length &&
            this.every(function (this_i, i) { return this_i == array[i]; });
    };
    return Table;
}(Array));
exports.__esModule = true;
exports["default"] = Table;
//# sourceMappingURL=Table.js.map