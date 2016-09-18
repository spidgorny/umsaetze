/// <reference path="../typings/index.d.ts" />

let bb = require('backbone');
const bbls = require('backbone.localstorage');

export default class CategoryCount extends bb.Model {

	catName: string;

	count: number;

	amount: number;

	color: string;

	constructor(...args: any[]) {
		super(args);
		//this.listenTo(this, 'change', this.saveToLS);
	}

	setColor(color) {
		this.set('color', color);
	}

}
