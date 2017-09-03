/// <reference path="../../typings/index.d.ts" />

const _ = require('underscore');

export default class SummaryLine {

	catName: string;

	average: number|string = 0;

	perCent: number|string = 0;

	background: string;

	id: string;

	perMonth: Array<any> = [];

	constructor(params?: Object) {
		if (params) {
			_.extend(this, params);
		}
	}

	combine(sl2: SummaryLine) {
		this.average += parseFloat(<any>sl2.average);
		this.perCent = parseFloat(<any>this.perCent) + parseFloat(<any>sl2.perCent);
		if (this.perMonth.length) {
			this.perMonth = _.map(this.perMonth, (el, index) => {
				// if (this.catName == 'Auto') console.log(el, sl2.perMonth[index]);
				el.value = parseFloat(el.value) + parseFloat(sl2.perMonth[index].value);
				// if (this.catName == 'Auto') console.log(el.value);
				el.value = el.value.toFixed(2);
				return el;
			});
		} else {
			// http://stackoverflow.com/questions/21003059/how-do-you-clone-an-array-of-objects-using-underscore
			this.perMonth = _.map(sl2.perMonth, _.clone);	// deep clone
		}
	}

}
