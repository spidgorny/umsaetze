import * as _ from "underscore";
import {Transaction} from './transaction';
import {Category} from './category';
import {ExpensesService} from './expenses.service';
import {Injectable} from '@angular/core';

@Injectable()
export class CategoryList {

	data: Map<string, Category> = new Map();

	constructor() {
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
		console.log(this.data);
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
		if (category) {
			color = category.color;
		} else {
			color = '#AAAAAA';
		}
		return color;
	}

}
