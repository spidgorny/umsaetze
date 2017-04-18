/// <reference path="typings/index.d.ts" />
// import sourceMapSupport from 'source-map-support';
// sourceMapSupport.install();

require('source-map-support').install();

const util = require('util');
const stream = require('stream');
const fs = require('fs');
const iconv = require('iconv-lite');
const _ = require('underscore');
import path = require('path');

function StringifyStream() {
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

	sourceFile = 'test/data/SpardaBank/umsaetze-1090729-2016-07-27-00-11-29.csv';

	keywordFile = 'test/data/keywords.xlsx';

	keyWords = {};

	convertMoneyFormat() {
		let transform = require('stream-transform');

		let totalRows = 1690;	// line-by-line counting will not work
/*		var counter = transform(function (record: Record, callback) {
			totalRows++;
			callback(null, record);
		}).on('finish', function() {
			console.log('Counted rows: ', totalRows);
		});
*/
		const ProgressBar = require('progress');
		let pb = new ProgressBar(':bar', {
			total: totalRows,
			width: 100
		});

		let storeColumns = null;
		let rows = 0;
		let transformer = transform(function (record: Record, callback) {
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
//		.pipe(counter)
		.pipe(transformer)
		.pipe(stringifier)
		// .pipe(process.stdout)
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
				// not sure why this is needed
				// var cells = row.values.slice(0, 2);

				//console.log(cells.join('\t'));
				//console.log(JSON.stringify(cells));
				let key = cells[1];
				let category = cells[2];
				//console.log(key, category);
				this.keyWords[key] = category;
			});
			//console.log(this.keyWords);
			resolve(this.keyWords);
		});
	}

	categorize(categoryList: Object) {
		const chalk = require( "chalk" );
		const fs = require('fs');
		const transform = require('stream-transform');
		const utf8 = require('utf8');
		const iconv = require('iconv-lite');

		let converterStream = iconv.decodeStream('ISO-8859-1');

		let transformer = transform((record: Record, callback) => {
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

		let input = fs.createReadStream(this.sourceFile.replace('.csv', '.import.csv'));
		//input.setEncoding(null);
		input.on(
			"error",
			function handleDataStreamError( error ) {
				console.log( chalk.bgRed.white( "Error event:", error.message ) );
			}
		);
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
		for (let keyWord in this.keyWords) {
			if (note.indexOf(keyWord) > -1) {
				console.log(keyWord, this.keyWords[keyWord]);
				return this.keyWords[keyWord];
			}
		}
		return category;
	}

	startCategorize() {
		sb.readExcelFile().then((categoryList) => {
			console.log('categoryList', categoryList);
			fs.writeFileSync('test/data/keywords.json', JSON.stringify(categoryList, '', '\n'));
			sb.categorize(categoryList);
			return true;
		}).catch((e) => {
			console.log('Promise error: ' + e);
		});
	}

}

let sb = new SpardaBank();
//sb.convertMoneyFormat();
sb.startCategorize();
