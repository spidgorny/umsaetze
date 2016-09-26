/// <reference path="../../typings/index.d.ts" />

let bb = require('backbone');
const bbls = require('backbone.localstorage');

export default class CategoryCount extends bb.Model {

	catName: string;

	count: number;

	amount: number;

	color: string;

	constructor(...args: any[]) {
		super(args);
		this.set('catName', args[0].catName);	// this should not be necessary but it is
		this.set('color', args[0].color);	// this should not be necessary but it is
		this.set('count', args[0].count);	// this should not be necessary but it is
		this.set('amount', args[0].amount);	// this should not be necessary but it is
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

}
