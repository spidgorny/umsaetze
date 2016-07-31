/// <reference path="typings/index.d.ts" />

declare class Record {

	account: string;
	category: string;
	currency: string;
	amount: string;
	payment_type: string;
	date: string;
	note: string;

}

class SpardaBank {

	sourceFile = 'umsaetze-1090729-2016-07-27-00-11-29.csv';

	keywordFile = 'keywords.xlsx';

	keyWords = {};

	convertMoneyFormat() {
		var fs = require('fs');
		var transform = require('stream-transform');

		var totalRows = 1690;	// line-by-line counting will not work
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
		var transformer = transform(function (record: Record, callback) {
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
		}, {parallel: 1});

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
//		.pipe(counter)
		.pipe(transformer)
		.pipe(stringifier)
		// .pipe(process.stdout)
		.pipe(output)).then(() => {
			console.log('Rows processed: ', rows);
		});
	}

	getParser() {
		var parse = require('csv-parse');
		var parser = parse({
			delimiter: ';',
			columns: true,
			comment: '#',
			skip_empty_lines: true,
		});
		return parser;
	}

	readExcelFile() {
		return new Promise((resolve, reject) => {
			var Excel = require('exceljs');
			var workbook = new Excel.Workbook();
			workbook.xlsx.readFile(this.keywordFile)
				.then(() => {
					var sheet = workbook.getWorksheet(1);
					this.dumpSheet(sheet);
					resolve(true);
				});
		});
	}

	dumpSheet(sheet) {
		return new Promise((resolve, reject) => {
			sheet.eachRow((row, rowNumber) => {
				var cells = row.values;
				// not sure why this is needed
				// var cells = row.values.slice(0, 2);

				//console.log(cells.join('\t'));
				//console.log(JSON.stringify(cells));
				var key = cells[1];
				var category = cells[2];
				//console.log(key, category);
				this.keyWords[key] = category;
			});
			console.log(this.keyWords);
			resolve(true);
		});
	}

	categorize() {
		var fs = require('fs');
		var transform = require('stream-transform');

		var transformer = transform((record: Record, callback) => {
			var shortNote = record.note.substr(0, 100);
			console.log(
				SpardaBank.twoTabs(record.amount), '\t',
				record.category, '\t',
				shortNote);
			callback(null, record);
		}, {parallel: 1});

		var input = fs.createReadStream(this.sourceFile);
		input
			.pipe(this.getParser())
			.pipe(transformer)
			//.pipe(process.stdout)
		;
	}

	/**
	 * Makes sure text is shown on two tabs
	 * @param text
	 * @returns {string}
	 */
	static twoTabs(text: string) {
		if (text.length < 8) {
			text += '\t';
		}
		return text;
	}

}

var sb = new SpardaBank();
sb.convertMoneyFormat();
sb.readExcelFile().then((x) => {
	sb.categorize();
}).catch((e) => {
	console.log('Promise error: ' + e);
});
