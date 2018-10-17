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
		const t = new Totals(ex);
		t.render();
	}

}

new TotalsTest().run();
