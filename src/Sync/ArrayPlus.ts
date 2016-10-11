const _ = require('underscore');

export default class ArrayPlus extends Array<any> {

	len: number;

	constructor(rows?: Array<any>) {
		super();
		if (rows) {
			//console.log('ArrayPlus', rows.length);
			rows.forEach((el, i) => {
				this[i] = el;
			});
		}
	}
	/**
	 * @param callback
	 */
	forEach(callback) {
		// super.forEach((row, i) => {
		for (let i in this) {
			let row = this[i];
			// console.log('forEach', i);
			if (this.isNumeric(i)) {
				let ok = callback(row, parseInt(i));
				if (ok === false) {
					break;
				}
			}
		}
	}

	isNumeric(object) {
		let stringObject = object && object.toString();
		return !_.isArray(object) && (stringObject - parseFloat(stringObject) + 1) >= 0;
	}

	equals( array ) {
		return this.length == array.length &&
			this.every( function(this_i,i) { return this_i == array[i] } )
	}

	get length() {
		let len = 0;
		for (let i in this) {
			if (this.isNumeric(i)) {
				len++;
			}
		}
		return len;
	}

	set length(len) {
		this.len = len;
	}

	/**
	 * http://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
	 * @param arr
	 * @returns {T|_ChainSingle<T>|TModel}
	 */
	mode() {
		return this.sort((a,b) =>
			this.filter(v => v.equals(a)).length
			- this.filter(v => v.equals(b)).length
		).pop();
	}

}
