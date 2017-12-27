import {JsonDataSourceService} from '../app/json-data-source.service';
import {ExpensesService} from '../app/expenses.service';
import {LocalStorageDataSourceService} from '../app/local-storage-data-source.service';

export class ExpensesService4Test extends ExpensesService {

	constructor(public loader: LocalStorageDataSourceService,
				public saver: LocalStorageDataSourceService) {
		super(loader, saver);
	}

}
