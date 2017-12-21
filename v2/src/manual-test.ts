import {Transaction} from './app/transaction';
import {JsonDataSourceService} from './app/json-data-source.service';
import 'reflect-metadata';
import {CategoryList} from './app/category-list';
import {ExpensesService} from './app/expenses.service';

const categories = new CategoryList();
// categories.setCategoriesFromExpenses();

const t = new Transaction({
	id: '123',
	date: '2017-12-18',
	amount: 10.20,
	category: 'Default',
	notes: 'Description'
}, categories);

console.log('sign', t.sign);

const jsonLoader = new JsonDataSourceService(categories);

class ExpensesService4Test extends ExpensesService {

	constructor(public loader: JsonDataSourceService, public saver: JsonDataSourceService) {
		super(loader, saver);
	}

}

const dataService = new ExpensesService4Test(jsonLoader, jsonLoader);
const from = dataService.getEarliest();
console.log('from', from, dataService.getLatest());
