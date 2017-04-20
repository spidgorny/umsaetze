///<reference path="../../typings/index.d.ts"/>

import Expenses from "../../src/Expenses/Expenses";
import Transaction from "../../src/Expenses/Transaction";
import MockStorage from "./MockStorage";
const fs = require('fs');
const Backbone = require('backbone');

export default class ExpensesMock extends Expenses {

	data: Transaction[] = [];

	localStorage = new MockStorage();

	constructor() {

	}

	load(file) {
		let json = fs.readFileSync(file);
		let data = JSON.parse(json);
		data.forEach(row => {
			this.data.push(new Transaction(row));
		});
	}

	size() {
		return this.data.length;
	}

	each(cb: Function) {
		return this.data.forEach(cb);
	}

}
