import {JsonDataSourceService} from '../app/json-data-source.service';
import {ExpensesService} from '../app/expenses.service';
import {LocalStorageDataSourceService} from '../app/local-storage-data-source.service';
import {ExpensesBase} from '../app/expenses-base';

export class ExpensesService4Test extends ExpensesBase {

	constructor(public loader: JsonDataSourceService,
				public saver: JsonDataSourceService) {
		super(loader, saver);
	}

}
