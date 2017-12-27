import {Injectable} from '@angular/core';
import {Transaction} from './transaction';
import {DataSourceInterface} from './data-source-interface';
import {CategoryList} from './category-list';

@Injectable()
export class LocalStorageDataSourceService implements DataSourceInterface {

	public static readonly LS_KEY = 'expenses';

	data: Transaction[] = [];

	constructor(protected categories: CategoryList) {
		const incoming = window.localStorage.getItem(LocalStorageDataSourceService.LS_KEY);
		// console.log('incoming', incoming);
		if (incoming) {
			const json = JSON.parse(incoming);
			json.forEach(el => {
				this.data.push(new Transaction(el, this.categories));
			});
		}
	}

	save(tr: Transaction) {
		console.log('saving', this.data.length);
		this.saveAll();
	}

	saveAll() {
		window.localStorage.setItem(LocalStorageDataSourceService.LS_KEY, JSON.stringify(this.data));
	}
}
