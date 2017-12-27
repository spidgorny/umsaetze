import {JsonDataSourceService} from '../app/datasource/json-data-source.service';
import {ExpensesService} from '../app/services/expenses.service';
import {LocalStorageDataSourceService} from '../app/datasource/local-storage-data-source.service';
import {ExpensesBase} from '../app/datasource/expenses-base';

export class ExpensesService4Test extends ExpensesBase {

	constructor(public loader: JsonDataSourceService,
				public saver: JsonDataSourceService) {
		super(loader, saver);
	}

}
