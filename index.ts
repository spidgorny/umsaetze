/// <reference path="typings/index.d.ts" />

const util = require('util');
const stream = require('stream');
const fs = require('fs');

function StringifyStream(){
	stream.Transform.call(this);

	this._readableState.objectMode = false;
	this._writableState.objectMode = true;
}
util.inherits(StringifyStream, stream.Transform);

StringifyStream.prototype._transform = function(obj, encoding, cb){
	this.push(JSON.stringify(obj));
	cb();
};

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
					var keyWords = this.dumpSheet(sheet);
					resolve(keyWords);
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
			//console.log(this.keyWords);
			resolve(this.keyWords);
		});
	}

	categorize(categoryList: Object) {
		var chalk = require( "chalk" );
		var fs = require('fs');
		var transform = require('stream-transform');
		var utf8 = require('utf8');
		var iconv = require('iconv-lite');

		var converterStream = iconv.decodeStream('ISO-8859-1');

		var transformer = transform((record: Record, callback) => {
			// record.note = utf8.encode(record.note);
			//record.note = iconv.decode(record.note, 'ISO-8859-1');
			// record.note = iconv.encode(record.note, 'UTF-8');
			record.category = this.getCategoryFor(record.note);
			var shortNote = record.note.substr(0, 120);

			console.log(
				SpardaBank.twoTabs(record.amount), '\t',
				record.category, '\t',
				shortNote);
			callback(null, record);
		}, {parallel: 1});

		var input = fs.createReadStream(this.sourceFile.replace('.csv', '.import.csv'));
		//input.setEncoding(null);
		input.on(
			"error",
			function handleDataStreamError( error ) {
				console.log( chalk.bgRed.white( "Error event:", error.message ) );
			}
		);
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
			//.pipe(converterStream)
			.pipe(this.getParser())
			.pipe(transformer)

			//.pipe(new StringifyStream())
			//.pipe(process.stdout)

			//.pipe(devnull())

			.pipe(stringifier)
			.pipe(output)
			//.end()
		;
	}

	/**
	 * Makes sure text is shown on two tabs
	 * @param text
	 * @returns {string}
	 */
	static twoTabs(text: string) {
		text = text.trim();
		if (text.length < 8) {
			text += '\t';
		}
		return text;
	}

	/**
	 * Makes sure text is shown on two tabs
	 * @param text
	 * @returns {string}
	 */
	static money(text: string) {
		let money = parseFloat(text.replace('.', '').replace(',', '.'));
		text = money.toString();
		if (text.indexOf('.') < 0) {	// not found
			text += '.00';
		}
		let padLength = 10 - text.length;
		text = ' '.repeat(padLength) + text;
		return text;
	}

	getCategoryFor(note: string) {
		let category = 'Default';
		for (var keyWord in this.keyWords) {
			if (note.indexOf(keyWord) > -1) {
				console.log(keyWord, this.keyWords[keyWord]);
				return this.keyWords[keyWord];
			}
		}
		return category;
	}

}

var sb = new SpardaBank();
//sb.convertMoneyFormat();
sb.readExcelFile().then((categoryList) => {
	console.log('categoryList', categoryList);
	fs.writeFileSync('keywords.json', JSON.stringify(categoryList, '', '\n'));
	sb.categorize(categoryList);
	return true;
}).catch((e) => {
	console.log('Promise error: ' + e);
});
