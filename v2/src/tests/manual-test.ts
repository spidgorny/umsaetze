import 'reflect-metadata';
import {Transaction} from '../app/models/transaction';
import {JsonDataSourceService} from '../app/datasource/json-data-source.service';
import {CategoryList} from '../app/services/category-list';
import {ExpensesService} from '../app/services/expenses.service';
import {ExpensesService4Test} from './ExpensesService4Test';
import 'datejs';

class ManualTest {

	protected categories;
	protected dataService: ExpensesService4Test;

	constructor() {
		this.categories = new CategoryList();
		// categories.setCategoriesFromExpenses();
		const jsonLoader = new JsonDataSourceService(this.categories);

		this.dataService = new ExpensesService4Test(jsonLoader, jsonLoader);
	}

	testSign() {
		const t = new Transaction({
			id: '123',
			date: '2017-12-18',
			amount: 10.20,
			category: 'Default',
			notes: 'Description'
		}, this.categories);

		console.log('sign', t.sign);
		return this;
	}

	testEarliest() {
		const from = this.dataService.getEarliest();
		console.log('from', from, this.dataService.getLatest());
		return this;
	}

	testFilterByMonth() {
		const april = new Date(2017, 3);
		console.log('april', april);
		const visible = this.dataService.filterByMonth(april);
		console.log('visible', visible.length);
		return this;
	}

	testDateCompare() {
		const april = new Date(2017, 3);
		console.log('april', april);
		const today = new Date();
		console.log('today is bigger than april', today > april);
		console.log('today is bigger than april by getTime()', today.getTime() > april.getTime());
		console.log(today.toString('yyyy-MM-dd'), today.getTime(), april.toString('yyyy-MM-dd'), april.getTime());
		return this;
	}

	testGetMonths() {
		const months = this.dataService.getMonths();
		console.log(months);
		return this;
	}

	testGetMonthPairs() {
		const months = this.dataService.getMonthPairs();
		console.log(months);
		return this;
	}

}

new ManualTest()
	// .testSign()
	// .testEarliest()
	// .testFilterByMonth()
	// .testDateCompare()
	.testGetMonths()
	.testGetMonthPairs()
;
