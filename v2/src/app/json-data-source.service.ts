/// <reference path="../custom_typings/json.d.ts" />

import {Injectable} from '@angular/core';
import * as JSONData from '../data/umsaetze-2017-04-20.json';
import {Transaction} from './transaction';
import {DataSourceInterface} from './data-source-interface';
import 'datejs';
import {CategoryList} from './category-list';

@Injectable()
export class JsonDataSourceService implements DataSourceInterface {

	file = '../expenses/umsaetze-2017-04-20.json';

	data: Transaction[] = [];

	constructor(public categories: CategoryList) {
		(<any[]><any>JSONData).forEach(row => {
			const tr = new Transaction(row, this.categories);
			// console.log(tr);
			this.data.push(tr);
		});
		console.log('jdss constructor', this.data.length);
	}

	save(tr: Transaction) {
		console.error('JsonDataSourceService::save() is not implemented');
	}

}
