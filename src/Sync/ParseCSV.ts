/// <reference path="../../typings/index.d.ts" />
/// <reference path="Table.ts" />

import {start} from "repl";
const Papa = require('papaparse');

export default class ParseCSV {

	data: string;

	constructor(data?: string) {
		this.data = data;
	}

	parseAndNormalize() {
		let csv = Papa.parse(this.data, {
			header: true,
			dynamicTyping: true,
			skipEmptyLines: true,
			comments: "#",
		});
		console.log('rows after parse', csv.data.length);
		csv.data = this.analyzeCSV(csv.data);
		console.log('rows after analyze', csv.data.length);
		csv.data = this.normalizeCSV(csv.data);
		console.log('rows after normalize', csv.data.length);
		//console.log(csv);
		return csv.data;
	}

	/**
	 * Some CSV files contain random data in the header
	 */
	private analyzeCSV(data: Table) {
		let startIndex = 0;
		data.forEach((row, i) => {
			if (!row.length) {
				startIndex = i+1;
			}
		});
		console.log('slicing ', startIndex, 'first rows');
		data = data.slice(startIndex);
		console.log('first row', data[0]);
		return data;
	}

	/**
	 * Some CSV files contain random data in the header
	 */
	private normalizeCSV(data: any) {
		console.log(data);
		for (let i = 0; i < 5 && i < data.length; i++) {
			let row = data[i];
			console.log(i, row);

		}
		return data;
	}

}
