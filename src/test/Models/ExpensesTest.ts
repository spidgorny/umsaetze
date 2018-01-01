import Expenses from "../../Expenses/Expenses";
import Transaction from "../../Expenses/Transaction";
import Window from '../DOM/Window';
import {FakeLocalStorage} from "../helper/FakeLocalStorage";
import TestFramework from "../TestFramework";

global['window'] = new Window();

export class ExpensesTest extends TestFramework {

	e: Expenses;

	constructor() {
		super();

		this.e = new Expenses([], {}, new FakeLocalStorage());
		const t1 = new Transaction({
				date: '2017-10-01',
				amount: 10.50,
				note: 'test 1',
			});
		t1.expenses = this.e;
		t1.init();
		console.log('Transaction.visible', t1.get('visible'));
		this.assert(t1.get('visible'));

		const t2 = new Transaction({
				date: '2018-01-01',
				amount: 10.50,
				note: 'test 1',
			});
		t2.expenses = this.e;
		t2.init();

		let t3 = new Transaction({
			date: '2018-01-02',
			amount: 100.10,
			note: 'test 2',
		});
		t3.expenses = this.e;
		t3.init();

		const transList = [
			t1,
			t2,
			t3,
		];
		this.e.models = transList;

		this.assertEquals(transList.length, this.e.models.length);
	}

	dumpVisible() {
		this.runTest('testDumpVisible');
		this.e.each((tr: Transaction) => {
			console.log(tr.get('id'), tr.get('visible'));
		});
	}

	testFilter() {
		this.runTest('testFilter');
		const list = this.e.filter(e => true);
		console.log(list.length);
	}

	testWhere() {
		this.runTest('testWhere');
		const list = this.e.where({});
		console.log(list.length);
	}

	testWhereDate() {
		this.runTest('testWhereDate');
		const list = this.e.where({date: '2018-01-01'});
		console.log(list.length);
	}

	testWhereVisible() {
		this.runTest('testWhereVisible');
		const list = this.e.where({visible: true});
		console.log(list.length);
	}

	testGetVisible() {
		this.runTest('testGetVisible');
		const visible = this.e.getVisible();
		console.log(visible.length);
	}

	testFilterByMonth() {
		this.runTest('testFilterByMonth');
		const visibleBefore = this.e.getVisibleCount();
		this.e.filterByMonth(new Date('2018-01-01'));
		const visibleAfter = this.e.getVisibleCount();
		console.log(visibleBefore, visibleAfter);
	}

}

const et = new ExpensesTest();
et.dumpVisible();
et.testFilter();
et.testWhere();
et.testWhereDate();
et.testWhereVisible();
et.testGetVisible();
et.testFilterByMonth();
