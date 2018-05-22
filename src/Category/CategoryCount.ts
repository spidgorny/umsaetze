import Backbone = require('backbone');
import '../Util/Object';
import {InvalidArgumentException} from '../Exception/InvalidArgumentException';
import * as _ from 'underscore';

const type = require('get-type');

/**
 * Model for holding category information for a month
 */
export default class CategoryCount extends Backbone.Model {

	catName: string;

	count: number;

	amount: number;

	color: string;

	static DEFAULT: string = 'Default';

	constructor(...args: any[]) {
		super();
		if (!args[0] || !('catName' in args[0])) {
			throw new InvalidArgumentException('CategoryCount needs parameters');
		}
		if (_.isObject(args[0].catName)) {
			//throw new InvalidArgumentException('catName must be string');
			for (let key in args[0].catName) {
				this.set(key, args[0].catName[key]);
			}
			args[0].catName = args[0].catName.name;
		}
		this.set('catName', args[0].catName);	// this should not be necessary but it is
		this.set('color', args[0].color);	// this should not be necessary but it is
		this.set('count', args[0].count);	// this should not be necessary but it is
		this.set('amount', args[0].amount);	// this should not be necessary but it is
		this.set('id', args[0].id);	// this should not be necessary but it is
		//this.listenTo(this, 'change', this.saveToLS);
		let color = this.get('color');
		if (!color) {
			this.set('color', this.pastelColor());
		}

		let count = this.get('count');
		if (!count) {
			this.set('count', 0);
		}

		let amount = this.get('amount');
		if (!amount) {
			this.set('amount', 0);
		}

		// fix after corruption
		if (type.isObject(this.catName)) {
			const bankData: any = this.catName;
			Object.assign(this, bankData);
			this.catName = bankData.name;
		}
	}

	setColor(color) {
		this.set('color', color);
	}

	pastelColor(){
		let r = (Math.round(Math.random() * 55) + 200).toString(16);
		let g = (Math.round(Math.random() * 55) + 200).toString(16);
		let b = (Math.round(Math.random() * 55) + 200).toString(16);
		return '#' + r + g + b;
	}

	getName() {
		let catName = this.get('catName');
		if (_.isObject(catName)) {
			catName = catName.name;
		}
		return catName;
	}

	getAmount(): string {
		return this.get('amount').toFixed(2);
	}

	resetCounters() {
		this.set('count', 0, { silent: true });
		// this.set('amount', 0, { silent: true });
	}

	incrementCount() {
		this.set('count', this.get('count')+1, { silent: true });
	}

	/**
	 * @deprecated - spoils CategoryView
	 * @param by
	 */
	incrementAmountBy(by: number) {
		this.set('amount', this.get('amount') + by, { silent: true });
	}

	getAverageAmountPerMonth(totalsPerMonth: Object) {
		let totals = Object.values(totalsPerMonth);
		let sum = totals.reduce(function(a, b) { return parseFloat(a) + parseFloat(b); });
		let avg = sum / totals.length;
		//console.log(totals, sum, avg);
		return avg.toFixed(2);
	}

	getAmountFloat() {
		return this.get('amount');
	}

}
