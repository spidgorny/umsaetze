import {detectFloat} from '../Util/Number';
import Papa from 'papaparse';
import Table from './Table';
import Row from './Row';
import 'datejs';

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
		}
		this.data = null;	// save RAM
		console.log('rows after parse', csv.length);
		csv = csv.trim();
		// csv = csv.trimAll(); // prevents analyzeCSV from working
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
		return new Table(sliced);
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
		console.log(JSON.stringify(common), 'common');
		data = common.filterByCommon(data);
		console.log('rows after filterByCommon', data.length);

		let dataWithHeader = new Table();
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
