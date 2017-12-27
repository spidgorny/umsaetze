import {Injectable} from '@angular/core';
import {LocalStorageDataSourceService} from './local-storage-data-source.service';
import {Transaction} from './transaction';
import {JsonDataSourceService} from './json-data-source.service';
import {CurrentMonthService} from './current-month.service';
import {CategoryList} from './category-list';
import {ExpensesBase} from './expenses-base';

@Injectable()
export class ExpensesService extends ExpensesBase {

	constructor(protected loader: LocalStorageDataSourceService,
				protected saver: LocalStorageDataSourceService) {
		super(loader, saver);
		// console.log('ExpensesService', this.loader.data.length);
		// this.saver.expenses = this.loader.expenses;
	}

}
