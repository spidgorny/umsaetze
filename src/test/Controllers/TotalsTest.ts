import TestFramework from "../TestFramework";
import {Totals} from "../../Totals/Totals";
import ExpensesMock from "../../Expenses/ExpensesMock";

class TotalsTest extends TestFramework {

	run() {
		this.testRender();
	}

	testRender() {
		const ex = new ExpensesMock();
		ex.load(__dirname + '/../../../src/test/data/umsaetze-2017-04-20.json');
		// ex.loadCSV(__dirname + '/../../../src/test/data/umsaetze-1090729-2018-10-07-18-42-43.csv');
		const t = new Totals(ex);
		t.render();
	}

}

new TotalsTest().run();
