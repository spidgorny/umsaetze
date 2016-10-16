/// <reference path="typings/index.d.ts" />
// import sourceMapSupport from 'source-map-support';
// sourceMapSupport.install();
"use strict";
var path = require('path');
var ParseMT940_1 = require("./src/Sync/ParseMT940");
require('source-map-support').install();
var util = require('util');
var stream = require('stream');
var fs = require('fs');
// const parser = require('./src/Sync/ParseCSV.js');
var ParseCSV_1 = require("./src/Sync/ParseCSV");
var iconv = require('iconv-lite');
var _ = require('underscore');
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
            delimiter: ';',
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
            skip_empty_lines: true,
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
                note: 'note',
            },
            delimiter: ';',
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
    SpardaBank.prototype.startCategorize = function () {
        sb.readExcelFile().then(function (categoryList) {
            console.log('categoryList', categoryList);
            fs.writeFileSync('keywords.json', JSON.stringify(categoryList, '', '\n'));
            sb.categorize(categoryList);
            return true;
        }).catch(function (e) {
            console.log('Promise error: ' + e);
        });
    };
    SpardaBank.prototype.testImport = function () {
        var testFixture = [
            {
                file: 'test/data/SpardaBank/umsaetze-1090729-2016-10-06-00-31-51.csv',
                rows: 234,
                result: [
                    {
                        date: new Date('Wed Oct 05 2016 00:00:00 GMT+0200 (W. Europe Daylight Time)'),
                        amount: -50.29,
                        note: 'TOTAL DEUTSCHLAND GM 04.10.2016 08.15.29 620895 EUR      50,29 EC          74110494 562760 PAN 6729509200010907293 FTS-Tankstelle//FRANKFURT/D 001 12/2017 GIROCARD EUR',
                    },
                    {
                        date: new Date('Wed Oct 05 2016 00:00:00 GMT+0200 (W. Europe Daylight Time)'),
                        amount: -35.64,
                        note: '1u1 Internet SE SEPA-BASISLASTSCHRIFT SVWZ+ OTHR sonst ige Zahlung KD-Nr. K1505564 9/ RG-Nr. 100031626551 EREF + 004199835838 MREF+ 002000 1185661 CRED+ DE74ZZZ000000 45294 EUR',
                    },
                ]
            },
            {
                file: 'test/data/SimpleImport.csv',
                rows: 4,
                result: [
                    {
                        date: new Date('Sat Oct 01 2016 00:00:00 GMT+0200 (W. Europe Daylight Time)'),
                        amount: 10,
                        note: 'Rewe' },
                    {
                        date: new Date('Sun Oct 02 2016 00:00:00 GMT+0200 (W. Europe Daylight Time)'),
                        amount: 20,
                        note: 'Penny' },
                ],
            },
            {
                file: 'test/data/DeutscheBank/Kontoumsaetze_100_390590800_20161010_221922.csv',
                rows: 3,
                result: [
                    {
                        date: new Date('Mon May 02 2016 00:00:00 GMT+0200 (W. Europe Daylight Time)'),
                        amount: -100,
                        note: 'SEPA-Lastschrift von Allg.Deutscher Automobil-Club ADAC e.V. ADAC E.V. <censored> <censored> BEITRAG: 01.05.16-01.05.17 DE16700500000006055830 BYLADEMMXXX MGLNR 452681382 / 452681374 AD45268138220150529001 DE30ZZZ00000056950 EUR' },
                    {
                        date: new Date('Mon May 02 2016 00:00:00 GMT+0200 (W. Europe Daylight Time)'),
                        amount: -90,
                        note: 'SEPA-Lastschrift von CONTINENTALE/EUROPA VERBUND 187195037 KFZ 137,88 DE95440400370347777500 COBADEFFXXX 1,68E+13 R0100033281694 DE95ZZZ00000053646 EUR' },
                ],
            },
            {
                file: 'test/data/Santander/Santander_2362226300_20161010_2217.csv',
                rows: 4,
                result: [
                    {
                        date: new Date('Mon May 02 2016 00:00:00 GMT+0200 (W. Europe Daylight Time)'),
                        amount: -68.18,
                        note: 'Lastschrift ??? SEPA-LASTSCHRIFT VON AACHENMUENCHENER 32940058755BBCSHCP IBAN DE26370400440500900608 BIC COBADEFF TYPE CO1 EREF+AM-VERS 010075276820 010516 1185217' },
                    {
                        date: new Date('Mon May 02 2016 00:00:00 GMT+0200 (W. Europe Daylight Time)'),
                        amount: -272.7,
                        note: 'Lastschrift ??? SEPA-LASTSCHRIFT VON HANSEMERKUR VERS. 32940058755BBCSDWM IBAN DE24200300000000241414 BIC HYVEDEMM TYPE CO1 EREF+133587242 MREF+141737784A00016' },
                ],
            },
            {
                file: 'test/data/Volksbank/Umsaetze_DE29501900006000010268_2016.10.10.csv',
                rows: 36,
                result: [
                    {
                        date: new Date('Mon Oct 10 2016 00:00:00 GMT+0200 (W. Europe Daylight Time)'),
                        amount: 10.2,
                        note: 'ISSUER DEUTSCHE POST AG DE29501900006000010268 FFVBDEFF LASTSCHRIFT\r\nDEUTSCHE POST/Frankfurt am\r\nMain/DE\r\n08.10.2016 um 13:08:44 Uhr\r\n58209953/034313/CICC/NPIN\r\n50190000/6000010268/1/1216\r\nREF 076433/260111 EUR' },
                    {
                        date: new Date('Mon Oct 10 2016 00:00:00 GMT+0200 (W. Europe Daylight Time)'),
                        amount: 175.99,
                        note: 'ISSUER GALERIA KAUFHOF GMBH FFM DE29501900006000010268 FFVBDEFF LASTSCHRIFT\r\nGaleria Kaufhof Frankfurt/F\r\nrankfurt/DE\r\n08.10.2016 um 14:41:33 Uhr\r\n67108002/168068/CICC/FPIN\r\n50190000/6000010268/1/1216 EUR' }
                ],
            },
            {
                file: 'test/data/Nassau/20161010-140238155-umsatz.CSV',
                rows: 5,
                result: [
                    {
                        date: new Date('Tue Oct 11 2016 00:00:00 GMT+0200 (W. Europe Daylight Time)'),
                        amount: -29,
                        note: '140238155 SEPA-ELV-LASTSCHRIFT EREF+66022610346682071016195738MREF+6602261063371610071957CRED+DE95ZZZ00001678202SVWZ+ELV66022610 07.10 19.57 ME31 COS 580 SAGT VIELEN DANK DE89200400000245333001 COBADEFFXXX EUR Umsatz vorgemerkt' },
                    {
                        date: new Date('Mon Oct 10 2016 00:00:00 GMT+0200 (W. Europe Daylight Time)'),
                        amount: -370,
                        note: '140238155 FOLGELASTSCHRIFT EREF+K11222371592/000005/16ZVS18FMREF+KFZF11100073236814102015CRED+DE09ZZZ00000000001SVWZ+KFZ-STEUER FUER F IL 137 FUER DIE ZEIT VOM 09.10.2016 BIS ZUM 08.10.2017 KASSENZEICHEN K11222371592ABWA+KKR ZENTRALKASSE DES BUNDES BUNDESKASSE IN HALLE/SAALE DE20860000000086001170 MARKDEF1860 EUR Umsatz gebucht' },
                ],
            },
            {
                file: 'test/data/Nassau/20161010-140238155-umsatz(1).CSV',
                rows: 5,
                result: [
                    {
                        date: new Date('Tue Oct 10 2016 00:00:00 GMT+0200 (W. Europe Daylight Time)'),
                        amount: -29,
                        note: '140238155 SEPA-ELV-LASTSCHRIFT ELV66022610 07.10 19.57 ME31 COS 580 SAGT VIELEN DANK DE89200400000245333001 COBADEFFXXX EUR Umsatz vorgemerkt' },
                    {
                        date: new Date('Mon Oct 10 2016 00:00:00 GMT+0200 (W. Europe Daylight Time)'),
                        amount: -370,
                        note: '140238155 FOLGELASTSCHRIFT KFZ-STEUER FUER F IL 137 FUER DIE ZEIT VOM 09.10.2016 BIS ZUM 08.10.2017 KASSENZEICHEN K11222371592 BUNDESKASSE IN HALLE/SAALE DE20860000000086001170 MARKDEF1860 EUR Umsatz gebucht' },
                ],
            },
        ];
        testFixture.forEach(function (set) {
            console.log('File: ' + set.file);
            var data = fs.readFileSync(set.file);
            data = iconv.decode(data, "ISO-8859-1");
            var parse = new ParseCSV_1.default(data);
            var nice = parse.parseAndNormalize();
            if (nice.length != set.rows) {
                console.log('parsed', nice.length, 'rows, expecting', set.rows);
                console.log(nice);
                throw new Error('number of rows is not the same');
            }
            var row0 = nice[0];
            row0 = _.pick(row0, 'date', 'amount', 'note');
            // specific order for JSON comparison
            row0 = {
                date: row0.date,
                amount: row0.amount,
                note: row0.note,
            };
            var row1 = nice[1];
            row1 = _.pick(row1, 'date', 'amount', 'note');
            row1 = {
                date: row1.date,
                amount: row1.amount,
                note: row1.note,
            };
            // if (_.isEqual(row0, set.result[0]) && _.isEqual(row1, set.result[1])) {
            if (JSON.stringify(row0) == JSON.stringify(set.result[0])
                && JSON.stringify(row1) == JSON.stringify(set.result[1])) {
                console.log('OK');
            }
            else {
                console.error('Parsed file does not match');
                console.log(JSON.stringify(row0));
                console.log(JSON.stringify(set.result[0]));
                console.log(JSON.stringify(row1));
                console.log(JSON.stringify(set.result[1]));
                throw new Error(set.file + ' test failed');
            }
        });
    };
    SpardaBank.prototype.testParser = function () {
        console.log('Loading file...');
        // let data = fs.readFileSync('test/data/SpardaBank/umsaetze-1090729-2016-10-06-00-31-51.csv');
        // let data = fs.readFileSync('test/data/SimpleImport.csv');
        // let data = fs.readFileSync('test/data/DeutscheBank/Kontoumsaetze_100_390590800_20161010_221922.csv');
        // let data = fs.readFileSync('test/data/Santander/Santander_2362226300_20161010_2217.csv');
        //let data = fs.readFileSync('test/data/Volksbank/Umsaetze_DE29501900006000010268_2016.10.10.csv');
        // let data = fs.readFileSync('test/data/Nassau/20161010-140238155-umsatz.CSV');
        var file = 'test/data/Nassau/20161010-140238155-umsMT940.TXT';
        console.log(file);
        var data = fs.readFileSync(file);
        console.log('read', data.length, 'bytes');
        var ext = path.extname(file).toLowerCase();
        var nice;
        if (ext == '.csv') {
            data = iconv.decode(data, "ISO-8859-1");
            var parse = new ParseCSV_1.default(data);
            nice = parse.parseAndNormalize();
        }
        else if (ext == '.txt') {
            var parse = new ParseMT940_1.default(data);
            nice = parse.parseAndNormalize();
        }
        else {
            throw new Error('Unknown extension: ' + ext);
        }
        for (var i = 0; i < 2 && i < nice.length; i++) {
            console.log(nice[i]);
        }
    };
    SpardaBank.prototype.testLongest = function () {
        var strings = [
            'a', 'bb', 'ccc', ''
        ];
        var longest = strings.reduce(function (a, b) { return a.length > b.length ? a : b; });
        console.log(longest, 'longest');
    };
    return SpardaBank;
}());
var sb = new SpardaBank();
//sb.convertMoneyFormat();
// sb.startCategorize();
// sb.testImport();
sb.testParser();
// sb.testLongest();
//# sourceMappingURL=index.js.map