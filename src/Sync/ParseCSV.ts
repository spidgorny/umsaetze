/// <reference path="../../typings/index.d.ts" />

import {start} from "repl";
const Papa = require('papaparse');
import Table from './Table';
import Row from './Table';
require('datejs');

/**
 * http://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
 * @param array
 * @returns {boolean}
 */
Array.prototype.equals = function( array ) {
	return this.length == array.length &&
		this.every( function(this_i,i) { return this_i == array[i] } )
};


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
		this.text = null;	// save RAM
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
		let startIndex = 0;
		rev.forEach((row, i) => {
			// first row with real data
			if (!startIndex && row.length && row[0] != '') {
				startIndex = i;
				console.log('trim @', startIndex);
			}
		});
		csv = csv.slice(startIndex);
		return csv.reverse();
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
		data = data.slice(startIndex);
		return data;
	}

	/**
	 * We got pure data with headers here
	 */
	private normalizeCSV(data: Table) {
		//console.log(data);
		let typeSet = this.getRowTypesForSomeRows(data);
		let common = this.mode(typeSet);
		console.log(common, 'common');

		//console.log(typeSet[0]);
		if (!typeSet[0].equals(common)) {
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

	getRowTypes(row: Row) {
		let types = [];
		row.forEach((el: any) => {
			let float = parseFloat(el);
			let date = Date.parse(el);
			let isDate = !!date && el.indexOf(',') == -1;	// dates are without ,
			if (float && !isDate) {
				types.push('number');
			} else if (isDate) {
				types.push('date');
			} else {
				types.push('string');
			}
		});
		return types;
	}

	getRowTypesForSomeRows(data: Table) {
		let typeSet = [];
		for (let i = 0; i < 10 && i < data.length; i++) {
			let row: Row = data[i];
			// console.log(i, row);
			let types = this.getRowTypes(row);
			//console.log(types);
			typeSet.push(types);
		}
		return typeSet;
	}

	/**
	 * http://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
	 * @param arr
	 * @returns {T|_ChainSingle<T>|TModel}
	 */
	mode(arr) {
		return arr.sort((a,b) =>
			arr.filter(v => v===a).length
			- arr.filter(v => v===b).length
		).pop();
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
				console.log(row);
				delete csv[i];
			}
		});
		return csv;
	}
}
