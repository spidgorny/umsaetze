/// <reference path="typings/index.d.ts" />
var util = require('util');
var stream = require('stream');
function StringifyStream() {
    stream.Transform.call(this);
    this._readableState.objectMode = false;
    this._writableState.objectMode = true;
}
util.inherits(StringifyStream, stream.Transform);
StringifyStream.prototype._transform = function (obj, encoding, cb) {
    this.push(JSON.stringify(obj));
    cb();
};
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
                var keyWords = _this.dumpSheet(sheet);
                resolve(keyWords);
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
            //console.log(this.keyWords);
            resolve(_this.keyWords);
        });
    };
    SpardaBank.prototype.categorize = function (categoryList) {
        var _this = this;
        var chalk = require("chalk");
        var fs = require('fs');
        var transform = require('stream-transform');
        var utf8 = require('utf8');
        var iconv = require('iconv-lite');
        var converterStream = iconv.decodeStream('ISO-8859-1');
        var transformer = transform(function (record, callback) {
            // record.note = utf8.encode(record.note);
            //record.note = iconv.decode(record.note, 'ISO-8859-1');
            // record.note = iconv.encode(record.note, 'UTF-8');
            record.category = _this.getCategoryFor(record.note);
            var shortNote = record.note.substr(0, 120);
            console.log(SpardaBank.twoTabs(record.amount), '\t', record.category, '\t', shortNote);
            callback(null, record);
        }, { parallel: 1 });
        var input = fs.createReadStream(this.sourceFile.replace('.csv', '.import.csv'));
        //input.setEncoding(null);
        input.on("error", function handleDataStreamError(error) {
            console.log(chalk.bgRed.white("Error event:", error.message));
        });
        var devnull = require('dev-null');
        var stringify = require('csv-stringify');
        var stringifier = stringify({
            header: true,
            columns: {
                account: 'account',
                category: 'category',
                currency: 'currency',
                amount: 'amount',
                payment_type: 'payment_type',
                date: 'date',
                note: 'note'
            },
            delimiter: ';'
        });
        var path = require('path');
        var ext = path.extname(this.sourceFile);
        var destination = path.basename(this.sourceFile, ext) + '.cat' + ext;
        console.log('Destination: ', destination);
        var output = fs.createWriteStream(destination);
        return input
            .pipe(this.getParser())
            .pipe(transformer)
            .pipe(stringifier)
            .pipe(output);
    };
    /**
     * Makes sure text is shown on two tabs
     * @param text
     * @returns {string}
     */
    SpardaBank.twoTabs = function (text) {
        text = text.trim();
        if (text.length < 8) {
            text += '\t';
        }
        return text;
    };
    /**
     * Makes sure text is shown on two tabs
     * @param text
     * @returns {string}
     */
    SpardaBank.money = function (text) {
        var money = parseFloat(text.replace('.', '').replace(',', '.'));
        text = money.toString();
        if (text.indexOf('.') < 0) {
            text += '.00';
        }
        var padLength = 10 - text.length;
        text = ' '.repeat(padLength) + text;
        return text;
    };
    SpardaBank.prototype.getCategoryFor = function (note) {
        var category = 'Default';
        for (var keyWord in this.keyWords) {
            if (note.indexOf(keyWord) > -1) {
                console.log(keyWord, this.keyWords[keyWord]);
                return this.keyWords[keyWord];
            }
        }
        return category;
    };
    return SpardaBank;
}());
var sb = new SpardaBank();
//sb.convertMoneyFormat();
sb.readExcelFile().then(function (categoryList) {
    console.log('categoryList', categoryList);
    sb.categorize(categoryList);
    return true;
}).catch(function (e) {
    console.log('Promise error: ' + e);
});
//# sourceMappingURL=index.js.map