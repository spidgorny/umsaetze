import {Injectable} from '@angular/core';
import {Transaction} from './transaction';
import {DataSourceInterface} from './data-source-interface';
import {CategoryList} from './category-list';

@Injectable()
export class LocalStorageDataSourceService implements DataSourceInterface {

	data: Transaction[] = [];

	constructor(public categories: CategoryList) {
		const incoming = window.localStorage.getItem('expenses');
		//console.log('incoming', incoming);
		if (incoming) {
			const json = JSON.parse(incoming);
			json.forEach(el => {
				this.data.push(new Transaction(el, this.categories));
			});
		}
	}

	save(tr: Transaction) {
		console.log('saving', this.data.length);
		window.localStorage.setItem('expenses', JSON.stringify(this.data));
	}

}
