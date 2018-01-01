import Expenses from "./Expenses";
import Transaction from "./Transaction";
import MockStorage from "../Util/MockStorage";
const fs = require('fs');

export default class ExpensesMock extends Expenses {

	localStorage: MockStorage;

	models: Transaction[] = [];

	constructor() {
		super([], {}, new MockStorage());
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
