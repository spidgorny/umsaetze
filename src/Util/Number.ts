import { unformat } from 'accounting-js';
import * as _ from 'underscore';

function detectFloat(source: String) {
	if (_.isUndefined(source)) return NaN;
	let float = unformat(source);
	let posComma = source.indexOf(',');
	if (posComma > -1) {
		let posDot = source.indexOf('.');
		if (posDot > -1 && posComma > posDot) {
			let germanFloat = unformat(source, ',');
			if (Math.abs(germanFloat) > Math.abs(float)) {
				float = germanFloat;
			}
		} else {
			// source = source.replace(/,/g, '.');
			float = unformat(source, ',');
		}
	}
	return float;
}

declare interface Number {
	clamp (min: Number, max: Number): number;
}

Number.prototype.clamp = function (min: number, max: number) {
	return Math.min(Math.max(this, min), max);
};
