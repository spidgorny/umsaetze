/// <reference path="typings/index.d.ts" />

var fs = require('fs');
var parse = require('csv-parse');
var transform = require('stream-transform');

var parser = parse({
	delimiter: ';',
	columns: true,
	comment: '#',
	skip_empty_lines: true,
});
var sourceFile = 'umsaetze-1090729-2016-07-27-00-11-29.csv';
var input = fs.createReadStream(sourceFile);

var storeColumns = null;
var transformer = transform(function(record, callback) {
	var amount = record.amount;
	amount = amount.replace('.', '');
	amount = amount.replace(',', '.');
	amount = parseFloat(amount);
	record.amount = amount;
	//record.amount3 = parseFloat(amount);
	//callback(null, JSON.stringify(record)+'\n');
	callback(null, record);
	if (!storeColumns) {
		storeColumns = {};
		//var columns = Object.keys(record);
		for (var key in record) {
			//noinspection JSUnfilteredForInLoop
			storeColumns[key] = key;
		}
		console.log(storeColumns);
	}
}, {parallel: 1});

var path = require('path');
var ext = path.extname(sourceFile);
var destination = path.basename(sourceFile, ext) + '.import' + ext;
console.log(destination);
var output = fs.createWriteStream(destination);

var stringify = require('csv-stringify');
var stringifier = stringify({
	header: true,
	columns: storeColumns,
	delimiter: ';',
});

input
	.pipe(parser)
	.pipe(transformer)
	.pipe(stringifier)
	// .pipe(process.stdout)
	.pipe(output)
;
