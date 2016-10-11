/// <reference path="../../typings/index.d.ts" />

import {start} from "repl";
const Papa = require('papaparse');
import Table from './Table';
import Row from './Row';
require('datejs');

/**
 * http://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
 * @param array
 * @returns {boolean}
 */
/*Array.prototype.equals = function( array ) {
	return this.length == array.length &&
		this.every( function(this_i,i) { return this_i == array[i] } )
};
*/

export default class ParseCSV {

	data: string;

	constructor(data?: string) {
		this.data = data;
	}

	parseAndNormalize() {
		let csv;
		if (typeof document == "this code is commented") {
			let csvObj = Papa.parse(this.data, {
				header: true,
				dynamicTyping: true,
				skipEmptyLines: true,
				comments: "#",
			});
			csv = csvObj.data;
		} else {
			csv = Table.fromText(this.data);
		}
		this.data = null;	// save RAM
		console.log('rows after parse', csv.length);
		csv = this.trim(csv);
		console.log('rows after trim', csv.length);
		csv = this.analyzeCSV(csv);
		console.log('rows after analyze', csv.length);
		csv = this.normalizeCSV(csv);
		console.log('rows after normalize', csv.length);
		csv = this.convertDataTypes(csv);
		console.log('rows after convertDataTypes', csv.length);
		return csv;
	}

	/**
	 * Remove empty lines from the bottom of the file.
	 * This is required for analyzeCSV() to work.
	 * @param csv
	 * @returns {Row[]}
	 */
	trim(csv: Table) {
		let rev = csv.reverse();	// start at the bottom of the file
		let startIndex = null;
		rev.forEach((row, i) => {
			// first row with real data
			if (startIndex == null
				&& row.length && row[0] != '') {
				startIndex = i;
				console.log('trim @', startIndex);
			}
		});
		let data = rev.slice(startIndex);
		// console.log(data[0]);
		data = data.reverse();
		return new Table(data);
	}

	/**
	 * Some CSV files contain random data in the header
	 */
	private analyzeCSV(data: Table) {
		// console.log('last row', data[data.length-1]);
		let startIndex = 0;
		data.forEach((row, i) => {
			if (!row.length || (row.length == 1 && row[0] == '')) {
				startIndex = i+1;
			}
		});
		console.log('slicing ', startIndex, 'first rows');
		let sliced = data.slice(startIndex);
		return new Table(sliced);
	}

	/**
	 * We got pure data with headers here
	 */
	private normalizeCSV(data: Table) {
		//console.log(data);
		let typeSet = data.getRowTypesForSomeRows();
		// console.log(typeSet, 'typeSet');
		let common = typeSet.mode();
		console.log(common, 'common');

		console.log(typeSet.length, 'typeSet.length');
		console.log(typeSet[0], 'typeSet[0]');
		console.log(data[0], 'data[0]');
		if (typeSet.length
			&& !typeSet[0].equals(common)) {
			// first row is a header
			data = <Table>data.slice(1);	// remove header
		}

		let header = this.getHeaderFromTypes(common);
		console.log(header, 'header');

		let dataWithHeader = new Table();
		data.forEach((row) => {
			dataWithHeader.push(
				this.zip(header, row));
		});
		console.log(dataWithHeader[0], 'dataWithHeader');

		return dataWithHeader;
	}

	getHeaderFromTypes(common: string[]) {
		let header = [];
		common.forEach((el, i) => {
			if (el == 'date' && header.indexOf('date') == -1) {
				header.push('date');
			} else if (el == 'number' && header.indexOf('amount') == -1) {
				header.push('amount');
			} else if (el == 'string' && header.indexOf('note') == -1) {
				header.push('note');
			} else {
				header.push('col_'+i);
			}
		});
		return header;
	}

	/**
	 * http://stackoverflow.com/questions/1117916/merge-keys-array-and-values-array-into-an-object-in-javascript
	 * @param names
	 * @param values
	 * @returns Row
	 */
	zip(names: Array<string>, values: Array<any>) {
		let result = new Row();
		for (let i = 0; i < names.length; i++) {
			result[names[i]] = values[i];
		}
		return result;
	}

	private convertDataTypes(csv: Table) {
		csv.forEach((row, i) => {
			if (row.amount) {
				let amount = row.amount.replace(',', '.');
				row.amount = parseFloat(amount); // german format
				row.date = Date.parseExact(row.date, 'dd.MM.yyyy');
			} else {
				//console.warn('convertDataTypes', row);
				delete csv[i];
			}
		});
		return csv;
	}
}
