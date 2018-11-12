import TestFramework from "../TestFramework";
import ExpensesMock from "../../Expenses/ExpensesMock";
import {Analyze} from '../../Analyze';

class AnalyzeTest extends TestFramework {

	run() {
		this.testRender();
	}

	testRender() {
		const ex = new ExpensesMock();
		// ex.load(__dirname + '/../../../src/test/data/2017-2018.json');
		ex.load(__dirname + '/../../../src/test/data/withCategory.json');
		const t = new Analyze(ex);
		t.render();
	}

}

new AnalyzeTest().run();
