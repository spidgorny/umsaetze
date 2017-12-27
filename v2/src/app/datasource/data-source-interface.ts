import {Transaction} from '../models/transaction';

export interface DataSourceInterface {

	data: Transaction[];

	save(tr: Transaction);

}

