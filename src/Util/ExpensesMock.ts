import Expenses from "../Expenses/Expenses";
import Transaction from "../Expenses/Transaction";
import MockStorage from "./MockStorage";
const fs = require('fs');
const Backbone = require('backbone');

export default class ExpensesMock extends Expenses {

	localStorage = new MockStorage();

	models: Transaction[] = [];

	constructor() {
		super();
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
		return <Transaction[]> <any>this.models.forEach((value, index) =>
			cb(value, index)
		);
	}

	dumpVisible() {
		let content = [];
		this.each((model: Transaction) => {
			content.push(model.get('visible') ? '+' : '-');
		});
		console.log('visible', content.join(''));
	}



}
