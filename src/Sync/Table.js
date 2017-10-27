var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Row from './Row';
import ArrayPlus from './ArrayPlus';
var Table = (function (_super) {
    __extends(Table, _super);
    function Table(rows) {
        var _this = _super.call(this) || this;
        if (rows) {
            rows.forEach(function (el, i) {
                _this[i] = new Row(el);
            });
        }
        return _this;
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
    Table.CSVToArray = function (strData, strDelimiter) {
        strDelimiter = (strDelimiter || ",");
        var objPattern = new RegExp(("(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
        var arrData = [[]];
        var arrMatches = null;
        while (arrMatches = objPattern.exec(strData)) {
            var strMatchedDelimiter = arrMatches[1];
            if (strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter) {
                arrData.push([]);
            }
            var strMatchedValue = void 0;
            if (arrMatches[2]) {
                strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
            }
            else {
                strMatchedValue = arrMatches[3];
            }
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        return (arrData);
    };
    Table.prototype.trim = function () {
        var rev = this.reverse();
        var startIndex = null;
        rev.forEach(function (row, i) {
            if (startIndex == null
                && row.length && row[0] != '') {
                startIndex = i;
                console.log('trim @', startIndex);
            }
        });
        var data = rev.slice(startIndex);
        data = data.reverse();
        return new Table(data);
    };
    Table.prototype.trimAll = function () {
        var data = new Table();
        this.forEach(function (row, i) {
            var rowObj = new Row(row);
            var rowTrimmed = rowObj.trim();
            if (rowTrimmed.length) {
                data.push(rowObj);
            }
        });
        return data;
    };
    Table.prototype.getRowTypesForSomeRows = function () {
        var typeSet = new Table();
        console.log('getRowTypesForSomeRows', this.length);
        var iter = 0;
        this.forEach(function (row0, i) {
            var row = new Row(row0);
            var types = row.getRowTypes();
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
            return countNull < row.length / 2;
        });
        return new Table(notNull);
    };
    Table.prototype.toVanilla = function () {
        var copy = [];
        this.forEach(function (row) {
            copy.push(row.toVanilla());
        });
        return copy;
    };
    Table.prototype.toVanillaTable = function () {
        var copy = [];
        this.forEach(function (row) {
            copy.push(Object.values(row.toVanilla()));
        });
        return copy;
    };
    return Table;
}(ArrayPlus));
export default Table;
//# sourceMappingURL=Table.js.map