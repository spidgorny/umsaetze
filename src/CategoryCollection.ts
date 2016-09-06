import Transaction from "./Transaction";
import CategoryCount from "./CategoryCount";
import Expenses from "./Expenses";

/**
 * Depends on Expenses to parse them
 * and retrieve the total values for each category
 */
export default class CategoryCollection extends Backbone.Collection<CategoryCount> {

	model: CategoryCount;

	expenses: Expenses;

	categoryCount = [];

	constructor(options?) {
		super(options);
	}

	setExpenses(ex: Expenses) {
		this.expenses = ex;
		this.listenTo(this.expenses, "change", this.change.bind(this));
	}

	getCategoriesFromExpenses() {
		this.expenses.each((transaction: Transaction) => {
			var categoryName = transaction.get('category');
			var exists = _.findWhere(this.categoryCount, {catName: categoryName});
			if (exists) {
				exists.count++;
				exists.amount += parseFloat(transaction.get('amount'));
			} else {
				this.categoryCount.push({
					catName: categoryName,
					count: 0,
					amount: 0,
				});
			}
		});
		console.log(this.categoryCount);
	}

	change() {
		console.log('CategoryCollection.change');
		this.getCategoriesFromExpenses();
	}

	getCategoryCount() {
		if (!this.categoryCount) {
			this.getCategoriesFromExpenses();
		}
		return this.categoryCount;
	}

	getOptions() {
		if (!this.categoryCount) {
			this.getCategoriesFromExpenses();
		}

		var options = [];
		this.categoryCount.forEach((value: CategoryCount) => {
			options.push(value.catName);
		});
		return options;
	}

}
