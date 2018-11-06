import TestFramework from "../TestFramework";
import {Totals} from "../../Totals/Totals";
import ExpensesMock from "../../Expenses/ExpensesMock";
import Expenses from "../../Expenses/Expenses";
import Transaction from "../../Expenses/Transaction";

class TotalsTest extends TestFramework {

	run() {
		this.testExpensesUnset();
		this.testRender();
	}

	loadFromCSVandSave() {
		const ex = new ExpensesMock();

		console.log('Loading json...');
		ex.load(__dirname + '/../../../src/test/data/umsaetze-2017-04-20.json');

		console.log('Loading csv...');
		ex.loadCSV(__dirname + '/../../../src/test/data/umsaetze-1090729-2018-10-07-18-42-43.csv');

		console.log('Saving...');
		ex.saveJSON(__dirname + '/../../../src/test/data/2017-2018.json');
	}

	loadFromCSVandSave2() {
		const ex = new ExpensesMock();

		console.log('Loading csv...');
		ex.loadCSV(__dirname + '/../../../src/test/data/umsaetze-1090729-2018-11-06-13-43-57.csv');

		console.log('Saving...');
		ex.saveJSON(__dirname + '/../../../src/test/data/2017-2018.json');
	}

	testRender() {
		const ex = new ExpensesMock();
		ex.load(__dirname + '/../../../src/test/data/2017-2018.json');
		const t = new Totals(ex);
		t.render();
	}

	private testExpensesUnset() {
		const e = new Expenses();
		const t = new Transaction({
			amount: 10,
		});
		e.add(t);
		// console.log(e.size());
		this.assert(e.size() == 1);
		e.remove(t);
		// console.log(e.size());
		this.assert(e.size() == 0);
	}
}

new TotalsTest().run();
