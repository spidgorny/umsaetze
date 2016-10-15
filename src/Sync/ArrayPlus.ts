const _ = require('underscore');
const naturalSort = require('javascript-natural-sort');

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
		let sorted_keys = Object.keys(this).sort(naturalSort);
		for (let i = 0; i < sorted_keys.length; i++) {
			let key = sorted_keys[i];
			let row = this[key];
			if (this.isNumeric(key)) {
				let ok = callback(row, parseInt(key));
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
