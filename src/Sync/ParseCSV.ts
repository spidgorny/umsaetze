import {detectFloat} from '../Util/Number';
import Papa from 'papaparse';
import Table from './Table';
import Row from './Row';
import 'datejs';
import {Logger} from "./Logger";

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

	logger: Logger;

	progress?: Function;

	constructor(data?: string) {
		this.data = data;
		this.logger = new Logger((line) => {
			console.log(line);
		})
	}

	log(...line) {
		this.logger.log(line);
	}

	parseAndNormalize() {
		let csv;
		if (typeof document == "boolean") {	// "boolean" is for false
			let csvObj = Papa.parse(this.data, {
				header: true,
				dynamicTyping: true,
				skipEmptyLines: true,
				comments: "#",
			});
			csv = csvObj.data;
		} else {
			csv = Table.fromText(this.data);
			csv.logger = this.logger;
		}
		this.data = null;	// save RAM
		this.log('rows after parse', csv.length);
		csv = csv.trim();
		// csv = csv.trimAll(); // prevents analyzeCSV from working
		this.log('rows after trim', csv.length);
		csv = this.analyzeCSV(csv);
		this.log('rows after analyze', csv.length);
		csv = this.normalizeCSV(csv);
		this.log('rows after normalize', csv.length);
		csv = this.convertDataTypes(csv);
		this.log('rows after convertDataTypes', csv.length);
		return csv;
	}

	/**
	 * Some CSV files contain random data in the header
	 * @public for tests
	 */
	public analyzeCSV(data: Table) {
		// console.log('last row', data[data.length-1]);
		let startIndex = 0;
		data.forEach((row, i) => {
			if (!row.length || (row.length == 1 && row[0] == '')) {
				startIndex = i+1;
			}
		});
		// console.log('slicing ', startIndex, 'first rows');
		let sliced = data.slice(startIndex);
		let table = new Table(sliced);
		table.logger = this.logger;
		return table;
	}

	/**
	 * We got pure data with headers here
	 */
	private normalizeCSV(data: Table) {
		//console.log(data);
		let typeSet = data.getRowTypesForSomeRows();
		typeSet = typeSet.filterMostlyNull();
		// console.log(typeSet, 'typeSet');
		let aCommon = typeSet.mode();
		let common = new Row(aCommon);
		this.log(JSON.stringify(common), 'common');
		data = common.filterByCommon(data);
		this.log('rows after filterByCommon', data.length);

		let dataWithHeader = new Table();
		dataWithHeader.logger = this.logger;
		data.forEach((row, i) => {
			let header = common.getHeaderFromTypes(row, i);
			if (i == 0) {
				Row.peek(row, common);
				console.log(JSON.stringify(header), 'header');
			}
			dataWithHeader.push(header);
		});

		//console.log(dataWithHeader[0], 'dataWithHeader line 0');
		return dataWithHeader;
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
				row.amount = detectFloat(row.amount);

				let date = Date.parseExact(row.date, 'dd.MM.yyyy');
				if (!date) {
					date = Date.parseExact(row.date, 'dd.MM.yy');
					if (!date) {
						console.warn('Date parse error', row.date, date);
					}
				}

				if (date) {
					row.date = date;
				}

			} else {
				//console.warn('convertDataTypes', row);
				delete csv[i];
			}
		});
		return csv;
	}
}
