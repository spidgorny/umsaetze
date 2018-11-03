import TestFramework from "../TestFramework";
import {Totals} from "../../Totals/Totals";
import ExpensesMock from "../../Expenses/ExpensesMock";

class TotalsTest extends TestFramework {

	run() {
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

	testRender() {
		const ex = new ExpensesMock();
		ex.load(__dirname + '/../../../src/test/data/2017-2018.json');
		const t = new Totals(ex);
		t.render();
	}

}

new TotalsTest().run();
