import * as _ from 'underscore';
import {Transaction} from '../models/transaction';
import {Category} from '../models/category';
import {ExpensesService} from './expenses.service';
import {Injectable} from '@angular/core';

@Injectable()
export class CategoryList {

	public static readonly INCOME = 'Income';

	data: Map<string, Category> = new Map();

	constructor() {
		const stored = this.fetch();
		if (stored) {
			this.data = new Map(JSON.parse(stored));
			this.data.forEach((json: any, key: string) => {
				this.data.set(key, new Category(json));
			});
		}
	}

	fetch() {
		if (typeof window !== 'undefined') {
			return window.localStorage.getItem('categories');
		}
		return null;
	}

	getData() {
		return Array.from(this.data.values());
	}

	resetCounters() {
		this.data.forEach((row: Category) => {
			row.amount = 0;
			row.count = 0;
		});
	}

	/**
	 * This must be called to initialize. Can not be DI because it leads to circular DI
	 * @param {ExpensesService} expenses
	 */
	setCategoriesFromExpenses(expenses: Transaction[]) {
		// console.profile('getCategoriesFromExpenses');
		this.resetCounters();
		expenses.forEach((transaction: Transaction) => {
			const categoryName = transaction.category;
			this.incrementCategoryData(categoryName, transaction);
		});
		// this.sortBy('amount');
		// console.log('category count', this.data.size);
		this.save();
		// console.profileEnd();
	}

	private incrementCategoryData(categoryName: any, transaction: Transaction) {
		const exists = this.data.get(categoryName);
		if (exists) {
			exists.count  += 1;
			exists.amount += transaction.amount;
		} else {
			this.data.set(categoryName, new Category({
				name: categoryName,
				count: 1,
				amount: transaction.amount,
			}));
		}
	}

	getColorFor(value: string) {
		const category = this.data.get(value);
		return category ? category.color : '#AAAAAA';
	}

	getTotal() {
		return Array.from(this.data.values()).reduce((acc, cat: Category) => {
			if (cat.name !== CategoryList.INCOME) {
				return acc + Math.abs(cat.amount);
			}
			return acc;
		}, 0);
	}

	/**
	 * Each category needs to calculate the percentage of it's value from the total
	 * @param {number} total
	 */
	setTotal(total: number) {
		this.data.forEach((cat: Category) => {
			cat.total = total;
		});
	}

	save() {
		if (typeof window !== 'undefined') {
			window.localStorage.setItem('categories',
				JSON.stringify(Array.from(this.data)));
		}
	}

	random() {
		const index = Math.floor(Math.random() * this.data.size);
		const keys = Array.from(this.data.keys());
		const key = keys[index];
		// console.log(index, keys, key);
		return this.data[key];
	}

}
