import * as _ from 'underscore';

export module global {
	declare interface Array<T> {
		average(): string;
	}
}

/*
// should not use =>
Array.prototype.average = function () {
	//console.log('average', this);
	if (this.length) {
		const sum = _.reduce(this, (a: string, b: string) => {
			return '' + (parseFloat(a) + parseFloat(b));
		});
		let avg = parseFloat(sum) / this.length;
		//console.log(totals, sum, avg);
		return avg.toFixed(2);
	} else {
		return null;
	}
};

*/
