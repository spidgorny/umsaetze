import {Transaction} from './app/transaction';
import {JsonDataSourceService} from './app/json-data-source.service';

const t = new Transaction({
	id: '123',
	date: '2017-12-18',
	amount: 10.20,
	category: 'Default',
	notes: 'Description'
});

console.log('sign', t.sign);

const dataService = new JsonDataSourceService();
const from = dataService.getEarliest();
console.log('from', from);
