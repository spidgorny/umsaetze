import {Injectable} from '@angular/core';
import {LocalStorageDataSourceService} from './local-storage-data-source.service';
import {Transaction} from './transaction';
import {JsonDataSourceService} from './json-data-source.service';
import {CurrentMonthService} from './current-month.service';
import {CategoryList} from './category-list';

@Injectable()
export class ExpensesService {

	constructor(protected loader: LocalStorageDataSourceService,
				protected saver: LocalStorageDataSourceService) {
		// console.log('ExpensesService', this.loader.data.length);
		// this.saver.expenses = this.loader.expenses;
	}

	get data() {
		// console.log('loader expenses', this.loader.expenses.length);
		return this.loader.data;
	}

	/**
	 *
	 * @returns {number}
	 */
	get size() {
		return this.loader.data.length;
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

	filterByMonth(value: Date) {
		value.setDate(1);	// make the beginning of the month
		return this.data.filter((tr: Transaction) => {
			return tr.isMonth(value);
		});
	}

	getVisible(curMonth: CurrentMonthService) {
		return this.filterByMonth(curMonth.getValue());
	}

	getTotal(visible: Transaction[]) {
		return visible.reduce((acc, tr: Transaction) => {
			if (tr.category !== CategoryList.INCOME) {
				return acc + Math.abs(tr.amount);
			}
			return acc;
		}, 0).toFixed(2);
	}

	saveAll() {
		this.saver.saveAll();
	}
}
