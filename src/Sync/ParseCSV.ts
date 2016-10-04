/// <reference path="../../typings/index.d.ts" />

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
		csv.data = this.analyzeCSV(csv.data);
		csv.data = this.normalizeCSV(csv.data);
		//console.log(csv);
	}

	/**
	 * Some CSV files contain random data in the header
	 */
	private analyzeCSV(data: Array[]) {
		let startIndex = 0;
		data.forEach((row, i) => {
			if (!row.length) {
				startIndex = i+1;
			}
		});
		data = data.slice(startIndex);
		return data;
	}

	/**
	 * Some CSV files contain random data in the header
	 */
	private normalizeCSV(data: any) {
		console.log(data);
		return [];
	}

}
