/// <reference path="typings/index.d.ts" />
var SpardaBank = (function () {
    function SpardaBank() {
        this.sourceFile = 'umsaetze-1090729-2016-07-27-00-11-29.csv';
        this.keywordFile = 'keywords.xlsx';
        this.keyWords = {};
    }
    SpardaBank.prototype.convertMoneyFormat = function () {
        var fs = require('fs');
        var transform = require('stream-transform');
        var totalRows = 1690; // line-by-line counting will not work
        /*		var counter = transform(function (record: Record, callback) {
                    totalRows++;
                    callback(null, record);
                }).on('finish', function() {
                    console.log('Counted rows: ', totalRows);
                });
        */
        var ProgressBar = require('progress');
        var pb = new ProgressBar(':bar', {
            total: totalRows,
            width: 100
        });
        var storeColumns = null;
        var rows = 0;
        var transformer = transform(function (record, callback) {
            pb.tick();
            var amount = record.amount;
            amount = amount.replace('.', '');
            amount = amount.replace(',', '.');
            var iAmount = parseFloat(amount);
            record.amount = iAmount.toString();
            //record.amount3 = parseFloat(amount);
            //callback(null, JSON.stringify(record)+'\n');
            if (!storeColumns) {
                storeColumns = {};
                //var columns = Object.keys(record);
                for (var key in record) {
                    //noinspection JSUnfilteredForInLoop
                    storeColumns[key] = key;
                }
                console.log(storeColumns);
            }
            rows++;
            callback(null, record);
        }, { parallel: 1 });
        var stringify = require('csv-stringify');
        var stringifier = stringify({
            header: true,
            columns: storeColumns,
            delimiter: ';'
        });
        var path = require('path');
        var ext = path.extname(this.sourceFile);
        var destination = path.basename(this.sourceFile, ext) + '.import' + ext;
        console.log('Destination: ', destination);
        var output = fs.createWriteStream(destination);
        var input = fs.createReadStream(this.sourceFile);
        var streamToPromise = require('stream-to-promise');
        streamToPromise(input
            .pipe(this.getParser())
            .pipe(transformer)
            .pipe(stringifier)
            .pipe(output)).then(function () {
            console.log('Rows processed: ', rows);
        });
    };
    SpardaBank.prototype.getParser = function () {
        var parse = require('csv-parse');
        var parser = parse({
            delimiter: ';',
            columns: true,
            comment: '#',
            skip_empty_lines: true
        });
        return parser;
    };
    SpardaBank.prototype.readExcelFile = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var Excel = require('exceljs');
            var workbook = new Excel.Workbook();
            workbook.xlsx.readFile(_this.keywordFile)
                .then(function () {
                var sheet = workbook.getWorksheet(1);
                _this.dumpSheet(sheet);
                resolve(true);
            });
        });
    };
    SpardaBank.prototype.dumpSheet = function (sheet) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            sheet.eachRow(function (row, rowNumber) {
                var cells = row.values;
                // not sure why this is needed
                // var cells = row.values.slice(0, 2);
                //console.log(cells.join('\t'));
                //console.log(JSON.stringify(cells));
                var key = cells[1];
                var category = cells[2];
                //console.log(key, category);
                _this.keyWords[key] = category;
            });
            console.log(_this.keyWords);
            resolve(true);
        });
    };
    SpardaBank.prototype.categorize = function () {
        var fs = require('fs');
        var transform = require('stream-transform');
        var transformer = transform(function (record, callback) {
            var shortNote = record.note.substr(0, 100);
            console.log(SpardaBank.twoTabs(record.amount), '\t', record.category, '\t', shortNote);
            callback(null, record);
        }, { parallel: 1 });
        var input = fs.createReadStream(this.sourceFile);
        input
            .pipe(this.getParser())
            .pipe(transformer);
    };
    /**
     * Makes sure text is shown on two tabs
     * @param text
     * @returns {string}
     */
    SpardaBank.twoTabs = function (text) {
        if (text.length < 8) {
            text += '\t';
        }
        return text;
    };
    return SpardaBank;
}());
var sb = new SpardaBank();
sb.convertMoneyFormat();
sb.readExcelFile().then(function (x) {
    sb.categorize();
}).catch(function (e) {
    console.log('Promise error: ' + e);
});
//# sourceMappingURL=index.js.map