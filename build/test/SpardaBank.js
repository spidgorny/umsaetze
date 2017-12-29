"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class SpardaBank {
    constructor() {
        this.sourceFile = 'test/data/SpardaBank/umsaetze-1090729-2016-07-27-00-11-29.csv';
        this.keywordFile = 'test/data/keywords.xlsx';
        this.keyWords = {};
    }
    convertMoneyFormat() {
        let transform = require('stream-transform');
        let totalRows = 1690;
        const ProgressBar = require('progress');
        let pb = new ProgressBar(':bar', {
            total: totalRows,
            width: 100
        });
        let storeColumns = null;
        let rows = 0;
        let transformer = transform(function (record, callback) {
            pb.tick();
            var amount = record.amount;
            amount = amount.replace('.', '');
            amount = amount.replace(',', '.');
            var iAmount = parseFloat(amount);
            record.amount = iAmount.toString();
            if (!storeColumns) {
                storeColumns = {};
                for (var key in record) {
                    storeColumns[key] = key;
                }
                console.log(storeColumns);
            }
            rows++;
            callback(null, record);
        }, { parallel: 1 });
        let stringify = require('csv-stringify');
        let stringifier = stringify({
            header: true,
            columns: storeColumns,
            delimiter: ';',
        });
        const path = require('path');
        let ext = path.extname(this.sourceFile);
        let destination = path.basename(this.sourceFile, ext) + '.import' + ext;
        console.log('Destination: ', destination);
        let output = fs.createWriteStream(destination);
        let input = fs.createReadStream(this.sourceFile);
        const streamToPromise = require('stream-to-promise');
        streamToPromise(input
            .pipe(this.getParser())
            .pipe(transformer)
            .pipe(stringifier)
            .pipe(output)).then(() => {
            console.log('Rows processed: ', rows);
        });
    }
    getParser() {
        const parse = require('csv-parse');
        let parser = parse({
            delimiter: ';',
            columns: true,
            comment: '#',
            skip_empty_lines: true,
        });
        return parser;
    }
    readExcelFile() {
        return new Promise((resolve, reject) => {
            const Excel = require('exceljs');
            let workbook = new Excel.Workbook();
            workbook.xlsx.readFile(this.keywordFile)
                .then(() => {
                var sheet = workbook.getWorksheet(1);
                var keyWords = this.dumpSheet(sheet);
                resolve(keyWords);
            });
        });
    }
    dumpSheet(sheet) {
        return new Promise((resolve, reject) => {
            sheet.eachRow((row, rowNumber) => {
                let cells = row.values;
                let key = cells[1];
                let category = cells[2];
                this.keyWords[key] = category;
            });
            resolve(this.keyWords);
        });
    }
    categorize(categoryList) {
        const chalk = require("chalk");
        const fs = require('fs');
        const transform = require('stream-transform');
        const utf8 = require('utf8');
        const iconv = require('iconv-lite');
        let converterStream = iconv.decodeStream('ISO-8859-1');
        let transformer = transform((record, callback) => {
            record.category = this.getCategoryFor(record.note);
            var shortNote = record.note.substr(0, 120);
            console.log(SpardaBank.twoTabs(record.amount), '\t', record.category, '\t', shortNote);
            callback(null, record);
        }, { parallel: 1 });
        let input = fs.createReadStream(this.sourceFile.replace('.csv', '.import.csv'));
        input.on("error", function handleDataStreamError(error) {
            console.log(chalk.bgRed.white("Error event:", error.message));
        });
        const devnull = require('dev-null');
        const stringify = require('csv-stringify');
        let stringifier = stringify({
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
        const path = require('path');
        let ext = path.extname(this.sourceFile);
        let destination = path.basename(this.sourceFile, ext) + '.cat' + ext;
        console.log('Destination: ', destination);
        let output = fs.createWriteStream(destination);
        return input
            .pipe(this.getParser())
            .pipe(transformer)
            .pipe(stringifier)
            .pipe(output);
    }
    static twoTabs(text) {
        text = text.trim();
        if (text.length < 8) {
            text += '\t';
        }
        return text;
    }
    static money(text) {
        let money = parseFloat(text.replace('.', '').replace(',', '.'));
        text = money.toString();
        if (text.indexOf('.') < 0) {
            text += '.00';
        }
        let padLength = 10 - text.length;
        text = ' '.repeat(padLength) + text;
        return text;
    }
    getCategoryFor(note) {
        let category = 'Default';
        for (let keyWord in this.keyWords) {
            if (note.indexOf(keyWord) > -1) {
                console.log(keyWord, this.keyWords[keyWord]);
                return this.keyWords[keyWord];
            }
        }
        return category;
    }
    startCategorize() {
        this.readExcelFile().then((categoryList) => {
            console.log('categoryList', categoryList);
            fs.writeFileSync('test/data/keywords.json', JSON.stringify(categoryList, [''], '\n'));
            this.categorize(categoryList);
            return true;
        }).catch((e) => {
            console.log('Promise error: ' + e);
        });
    }
}
exports.SpardaBank = SpardaBank;
//# sourceMappingURL=SpardaBank.js.map