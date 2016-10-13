import ArrayPlus from "./ArrayPlus";
import Table from "./Table";
const _ = require('underscore');
const _isNumeric = require('underscore.isnumeric');

export default class Row extends ArrayPlus {
	date: Date;
	amount: number;
	note: string;

	constructor(rawData?) {
		super(rawData);
	}

	getRowTypes() {
		let types = [];
		this.forEach((el: any) => {
			// console.log('getRowTypes', el);
			let float = parseFloat(el);
			let date = Date.parse(el);
			let isDate = !!date && el.indexOf(',') == -1;	// dates are without ","
			let isEmpty = _.isNull(el)
				|| _.isUndefined(el)
				|| el == '';
			let commas = 0;
			if (_.isString(el)) {
				commas = el.split(',').length - 1;
			}
			let onlyNumbers = /^[\-,\.\d]+$/.test(el);
			if (float && !isDate && commas == 1 && onlyNumbers) {
				types.push('number');
			} else if (isDate) {
				types.push('date');
			} else if (isEmpty) {
				types.push('null');
			} else {
				types.push('string');
			}
		});
		// this.peek(this, types);
		return new ArrayPlus(types);
	}

	peek(a, b) {
		console.log('-- ', a.length, b.length);
		let maxLen = 50;
		a.forEach((aa: string, i: number) => {
			aa = aa || '';
			let bb = b[i] || '';
			aa = aa.substr(0, maxLen);
			bb = bb.substr(0, maxLen);
			let paddingLength = maxLen - aa.length;
			let padding = ' '.repeat(paddingLength);
			console.log(aa, padding, '\t', bb);
		});
	}

	filterByCommon(data: Table) {
		let filtered = data.filter((row: Row) => {
			let rowTypes = row.getRowTypes();
			return rowTypes.equals(this);
		});
		return new Table(filtered);
	}

	getHeaderFromTypes(dataRow: Row) {
		let header = new Row();

		let strings = [];
		this.forEach((el, i) => {
			if (el == 'date' && header.indexOf('date') == -1) {
				header.date = dataRow[i];
			} else if (el == 'number' && header.indexOf('amount') == -1) {
				header.amount = dataRow[i];
			} else if (el == 'string' && header.indexOf('note') == -1) {
				strings.push(dataRow[i]);
			}
		});

		// http://stackoverflow.com/questions/6521245/finding-longest-string-in-array
		let longest = strings.reduce(function (a, b) { return a.length > b.length ? a : b; });
		header.note = longest;

		return header;
	}

}
