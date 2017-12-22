import * as _ from "underscore";
import {Transaction} from './transaction';
import {Category} from './category';
import {ExpensesService} from './expenses.service';
import {Injectable} from '@angular/core';

@Injectable()
export class CategoryList {

	data: Map<string, Category> = new Map();

	constructor() {
		const stored = window.localStorage.getItem('categories');
		if (stored) {
			this.data = new Map(JSON.parse(stored));
			this.data.forEach((json: any, key: string) => {
				this.data.set(key, new Category(json));
			});
		}
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
		console.profile('getCategoriesFromExpenses');
		this.resetCounters();
		expenses.forEach((transaction: Transaction) => {
			let categoryName = transaction.category;
			this.incrementCategoryData(categoryName, transaction);
		});
		// this.sortBy('amount');
		console.log('category count', this.data.size);
		this.save();
		console.profileEnd();
	}

	private incrementCategoryData(categoryName: any, transaction: Transaction) {
		let exists = this.data.get(categoryName);
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
		let color;
		let category = this.data.get(value);
		color = category ? category.color : '#AAAAAA';
		return color;
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
		window.localStorage.setItem('categories', JSON.stringify(Array.from(this.data)));
	}

}
