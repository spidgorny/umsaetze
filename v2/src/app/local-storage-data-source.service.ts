import {Injectable} from '@angular/core';
import {Transaction} from './transaction';
import {DataSourceInterface} from './data-source-interface';

@Injectable()
export class LocalStorageDataSourceService implements DataSourceInterface {

	data: Transaction[] = [];

	constructor() {
		const incoming = window.localStorage.getItem('expenses');
		console.log('incoming', incoming);
		if (incoming) {
			const json = JSON.parse(incoming);
			json.forEach(el => {
				this.data.push(new Transaction(el));
			});
		}
	}

	save(tr: Transaction) {
		console.log('saving', this.data.length);
		window.localStorage.setItem('expenses', JSON.stringify(this.data));
	}

}
