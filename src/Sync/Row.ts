/// <reference path="../../typings/index.d.ts" />

import ArrayPlus from "./ArrayPlus";
import Table from "./Table";
const _ = require('underscore');
const accounting = require('accounting-js');
// const _isNumeric = require('underscore.isnumeric');
require('../Util/String');
import detectFloat from "../Util/Number";

export default class Row extends ArrayPlus {
	date: Date;
	amount: number;
	note: string;

	constructor(rawData?) {
		super(rawData);
	}

	trim() {
		let copy = new Row();
		this.forEach((el, i) => {
			el = (el || '').trim();
			if (el.length) {
				copy[i] = el;
			}
		});
		return copy;
	}

	getRowTypes() {
		let types = [];
		this.forEach((el: any) => {
			// console.log('getRowTypes', el);
			// let float = parseFloat(el);	// does not handle 1.000,12 well
			let float = detectFloat(el);

			let date = Date.parse(el);
			let isDate = !!date && el.indexOf(',') == -1;	// dates are without ","
			let isEmpty = _.isNull(el)
				|| _.isUndefined(el)
				|| el == '';
			let commas = 0;
			if (_.isString(el)) {
				commas = el.split(',').length - 1;
			}
			let elWithoutEUR = (el || '').replace('EUR', '').trim();
			let onlyNumbers = /^[\-,\.\d]+$/.test(elWithoutEUR);
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
		//Row.peek(this, types);
		return new Row(types);
	}

	static peek(a, b, c?) {
		console.log('-- ', a.length, b.length, c ? c.length : '');
		let maxLen = 50;
		a.forEach((aa: string, i: number) => {
			aa = aa || '';
			let bb = b[i] || '';
			let cc = c ? c[i] || '' : '';
			aa = Row.padTo(aa, maxLen);
			bb = Row.padTo(bb, maxLen);
			cc = Row.padTo(cc, maxLen);
			console.log(aa, '\t', bb, '\t', cc);
		});
	}

	static padTo(aa, maxLen: number) {
		aa = aa.replace(/(?:\r\n|\r|\n)/g, ' ');
		aa = aa.substr(0, maxLen);
		let paddingLength = maxLen - aa.length;
		let padding = ' '.repeat(paddingLength);
		return aa + padding;
	}

	filterByCommon(data: Table) {
		let matchNumber = 0;
		let filtered = data.filter((row: Row, i: number) => {
			let rowTypes = row.getRowTypes();
			if (i+1 == 5) {
				Row.peek(row, rowTypes, this);
			}
			let match = rowTypes.similar(this);
			let matchPercent = rowTypes.similarPercent(this);
			console.log(i+1, match, '/', this.length, '=', matchPercent, '%', row.length);
			// let firstMatch100 = matchNumber == 0 && matchPercent == 100;
			let restMatch80 = /*matchNumber &&*/ matchPercent >= 80;
			let sameLength = row.length == this.length;
			let bReturn = /*firstMatch100 ||*/ restMatch80 && sameLength;
			matchNumber += bReturn ? 1 : 0;
			return bReturn;
		});
		return new Table(filtered);
	}

	getHeaderFromTypes(dataRow: Row, rowNr: number) {
		let header = new Row();

		let strings = [];
		this.forEach((el, i) => {
			if (el == 'date' && !header.date) {
				header.date = dataRow[i];
			} else if (el == 'number' && !header.amount) {
				header.amount = dataRow[i];
			} else if (el == 'string') {
				strings.push(dataRow[i].trim());
			}
		});

		// http://stackoverflow.com/questions/6521245/finding-longest-string-in-array
		//let longest = strings.reduce(function (a, b) { return a.length > b.length ? a : b; });
		//header.note = longest.trim();
		header.note = strings.join(' ');

		if (!rowNr) {
			// console.log(this, 'common');
			// console.log(strings, 'strings');
			// console.log(dataRow, 'dataRow');
			// console.log(header, 'header');
		}

		return header;
	}

	similar(to: Array<string>) {
		let theSame = 0;
		this.forEach((el, i) => {
			let bb = to[i];
			theSame += el == bb ? 1 : 0;
		});
		return theSame;
	}

	similarPercent(to: Array<string>) {
		let similar = this.similar(to);
		return similar / this.length * 100;
	}

}
