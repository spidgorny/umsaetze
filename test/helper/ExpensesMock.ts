///<reference path="../../typings/index.d.ts"/>

import Expenses from "../../src/Expenses/Expenses";
import Transaction from "../../src/Expenses/Transaction";
import MockStorage from "./MockStorage";
const fs = require('fs');
const Backbone = require('backbone');

export default class ExpensesMock extends Expenses {

	localStorage = new MockStorage();

	models: Transaction[] = [];

	constructor() {

	}

	load(file) {
		let json = fs.readFileSync(file);
		let data = JSON.parse(json);
		data.forEach(row => {
			this.models.push(new Transaction(row));
		});
	}

	size() {
		return this.models.length;
	}

	each(cb: Function) {
		return this.models.forEach(cb);
	}

	dumpVisible() {
		let content = [];
		this.each((model: Transaction) => {
			content.push(model.get('visible') ? '+' : '-');
		});
		console.log('visible', content.join(''));
	}



}
