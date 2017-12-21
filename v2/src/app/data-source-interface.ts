import {Transaction} from './transaction';

export interface DataSourceInterface {

	save(tr: Transaction);

}

