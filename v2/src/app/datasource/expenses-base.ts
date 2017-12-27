import {CategoryList} from '../services/category-list';
import {CurrentMonthService} from '../services/current-month.service';
import {Transaction} from '../models/transaction';
import {LocalStorageDataSourceService} from './local-storage-data-source.service';
import {DataSourceInterface} from './data-source-interface';
import {Category} from '../models/category';

export class ExpensesBase {

	constructor(protected loader: DataSourceInterface,
				protected saver: DataSourceInterface) {
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

	filterByCategory(category: Category) {
		return this.data.filter((tr: Transaction) => {
			return tr.category === category.name;
		});
	}

	getMonths() {
		const months = [];
		const from = this.getEarliest().moveToFirstDayOfMonth();
		const till = this.getLatest().moveToLastDayOfMonth();
		// console.log({
		// 	from: from.toString('yyyy-MM-dd HH:mm'),
		// 	till: till.toString('yyyy-MM-dd HH:mm'),
		// });
		for (const month = from; month.compareTo(till) === -1; month.addMonths(1)) {
			const copy = month.clone();
			months.push(copy);
		}
		return months;
	}

	getMonthPairs() {
		return this.getMonths().map((month: Date) => {
			const next = month.clone();
			next.addMonths(1)
				.add(<IDateJSLiteral>{seconds: -1});
			return {
				month,
				next,
			};
		});
	}

	getMonthlyTotalsFor(category: Category) {
		const categoryData = this.filterByCategory(category);
		const sparks = {};
		this.getMonthPairs().forEach((pair) => {
			// console.log({
			// 	month: month.toString('yyyy-MM-dd HH:mm'),
			// 	month1: month1.toString('yyyy-MM-dd HH:mm'),
			// 	today_is_between: Date.today().between(month, month1)
			// });
			let sum = 0;
			categoryData.forEach((transaction: Transaction) => {
				const sameMonth = transaction.getDate()
					.between(pair.month, pair.next);
				if (sameMonth) {
					sum += transaction.amount;
					// count++;
					// category.incrementAmountBy(transaction.getAmount());	// spoils CategoryView
				}
			});
			const key = pair.month.toString('yyyy-MM');
			sparks[key] = Math.abs(sum).toFixed(2);
		});
		// console.log(category.getName(), count);
		return sparks;
	}

}
