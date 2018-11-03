import Expenses from "./Expenses";
import Transaction from "./Transaction";
import MockStorage from "../Util/MockStorage";
import {TransactionFactory} from "./TransactionFactory";
import ParseCSV from "../Sync/ParseCSV";
import {Logger} from "../Sync/Logger";
const fs = require('fs');

export default class ExpensesMock extends Expenses {

	localStorage: MockStorage;

	models: Transaction[] = [];

	constructor(tf?: TransactionFactory) {
		super([], {}, new MockStorage(), tf);
	}

	load(file: string) {
		let json = fs.readFileSync(file);
		let data = JSON.parse(json);
		this.addAll(data);
	}

	addAll(rows: any[]) {
		rows.forEach(row => {
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

	loadCSV(file: string) {
		let data = fs.readFileSync(file);
		let parser = new ParseCSV(data);
		parser.logger = new Logger((line) => {
			// no log
		});
		parser.progress = (step, much) => {
			console.log(step, much);
		};
		let csv = parser.parseAndNormalize();
		this.addAll(csv);
	}

}
