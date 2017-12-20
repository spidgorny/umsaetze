import {Injectable} from '@angular/core';
import {LocalStorageDataSourceService} from './local-storage-data-source.service';
import {Transaction} from './transaction';
import {JsonDataSourceService} from './json-data-source.service';

@Injectable()
export class ExpensesService {

	constructor(public loader: LocalStorageDataSourceService, public saver: LocalStorageDataSourceService) {
		console.log('ExpensesService', this.loader.data.length);
		// this.saver.data = this.loader.data;
	}

	get data() {
		console.log('loader data', this.loader.data.length);
		return this.loader.data;
	}

	/**
	 *
	 * @returns {number}
	 */
	get size() {
		return this.saver.data.length;
	}

	getEarliest() {
		if (!this.size) {
			return new Date();
		}
		let min = new Date().addYears(10).valueOf();
		this.data.forEach((row: Transaction) => {
			const dDate = row.getDate();
			const date: number = dDate.valueOf();
			if (date < min) {
				min = date;
			}
		});
		return new Date(min);
	}

	getLatest() {
		if (!this.size) {
			return new Date();
		}
		let min = new Date('1970-01-01').valueOf();
		this.data.forEach((row: Transaction) => {
			const date: number = row.getDate().valueOf();
			if (date > min) {
				min = date;
			}
		});
		return new Date(min);
	}

	save(tr: Transaction) {
		this.saver.save(tr);
	}

}
