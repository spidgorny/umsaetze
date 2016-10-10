const _ = require('underscore');

export default class Row extends Array<any> {
	date: Date;
	amount: number;
	note: string;

	constructor(rawData) {
		super();
		_.extend(this, rawData);
	}

	getRowTypes() {
		let types = [];
		this.forEach((el: any) => {
			let float = parseFloat(el);
			let date = Date.parse(el);
			let isDate = !!date && el.indexOf(',') == -1;	// dates are without ","
			let commas = el.split(',').length - 1;
			let isEmpty = _.isNull(el)
				|| _.isUndefined(el)
				|| el == '';
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
		return types;
	}

	forEach(callback) {
		super.forEach((row, i) => {
			if (_.isNumber(i)) {
				callback(row, i);
			}
		});
	}

}
