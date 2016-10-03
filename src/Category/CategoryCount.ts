/// <reference path="../../typings/index.d.ts" />

import Expenses from "../Expenses";
let Backbone = require('backbone');
// const bbls = require('backbone.localstorage');

Object.values = obj => Object.keys(obj).map(key => obj[key]);

export default class CategoryCount extends Backbone.Model {

	catName: string;

	count: number;

	amount: number;

	color: string;

	constructor(...args: any[]) {
		super();
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
		return this.get('catName');
	}

	getAmount() {
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

}
