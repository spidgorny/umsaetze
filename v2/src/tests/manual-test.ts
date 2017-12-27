import 'reflect-metadata';
import {Transaction} from '../app/transaction';
import {JsonDataSourceService} from '../app/json-data-source.service';
import {CategoryList} from '../app/category-list';
import {ExpensesService} from '../app/expenses.service';
import 'datejs';

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

const april = new Date(2017, 3);
console.log('april', april);
const visible = dataService.filterByMonth(april);
console.log('visible', visible.length);

const today = new Date();
console.log('today is bigger than april', today > april);
console.log('today is bigger than april by getTime()', today.getTime() > april.getTime());
console.log(today.toString('yyyy-MM-dd'), today.getTime(), april.toString('yyyy-MM-dd'), april.getTime());
