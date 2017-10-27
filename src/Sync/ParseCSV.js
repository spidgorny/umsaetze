import { detectFloat } from '../Util/Number';
import Papa from 'papaparse';
import Table from './Table';
import Row from './Row';
import 'datejs';
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
            csv = Table.fromText(this.data);
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
    };
    ParseCSV.prototype.analyzeCSV = function (data) {
        var startIndex = 0;
        data.forEach(function (row, i) {
            if (!row.length || (row.length == 1 && row[0] == '')) {
                startIndex = i + 1;
            }
        });
        console.log('slicing ', startIndex, 'first rows');
        var sliced = data.slice(startIndex);
        return new Table(sliced);
    };
    ParseCSV.prototype.normalizeCSV = function (data) {
        var typeSet = data.getRowTypesForSomeRows();
        typeSet = typeSet.filterMostlyNull();
        var aCommon = typeSet.mode();
        var common = new Row(aCommon);
        console.log(JSON.stringify(common), 'common');
        data = common.filterByCommon(data);
        console.log('rows after filterByCommon', data.length);
        var dataWithHeader = new Table();
        data.forEach(function (row, i) {
            var header = common.getHeaderFromTypes(row, i);
            if (i == 0) {
                Row.peek(row, common);
                console.log(JSON.stringify(header), 'header');
            }
            dataWithHeader.push(header);
        });
        return dataWithHeader;
    };
    ParseCSV.prototype.zip = function (names, values) {
        var result = new Row();
        for (var i = 0; i < names.length; i++) {
            result[names[i]] = values[i];
        }
        return result;
    };
    ParseCSV.prototype.convertDataTypes = function (csv) {
        csv.forEach(function (row, i) {
            if (row.amount) {
                row.amount = detectFloat(row.amount);
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
                delete csv[i];
            }
        });
        return csv;
    };
    return ParseCSV;
}());
export default ParseCSV;
//# sourceMappingURL=ParseCSV.js.map