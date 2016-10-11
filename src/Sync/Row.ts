import ArrayPlus from "./ArrayPlus";
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
			if (float && !isDate && commas == 1) {
				types.push('number');
			} else if (isDate) {
				types.push('date');
			} else if (isEmpty) {
				types.push('null');
			} else {
				types.push('string');
			}
		});
		return new ArrayPlus(types);
	}

}
