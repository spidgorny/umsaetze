import Transaction from "./Transaction";
import CategoryCount from "./CategoryCount";
import Expenses from "./Expenses";
var elapse = require('elapse');
elapse.configure({
	debug: true
});

/**
 * Depends on Expenses to parse them
 * and retrieve the total values for each category
 */
export default class CategoryCollection extends Backbone.Collection<CategoryCount> {

	model: CategoryCount;

	expenses: Expenses;

	constructor(options?) {
		super(options);
	}

	setExpenses(ex: Expenses) {
		this.expenses = ex;
		this.listenTo(this.expenses, "change", this.change);
	}

	getCategoriesFromExpenses() {
		elapse.time('getCategoriesFromExpenses');
		this.reset();
		this.expenses.each((transaction: Transaction) => {
			var categoryName = transaction.get('category');
			if (categoryName) {
				this.incrementCategoryData(categoryName, transaction);
			}
		});
		//console.log(this.categoryCount);
		elapse.timeEnd('getCategoriesFromExpenses');
		this.trigger('update');
	}

	private incrementCategoryData(categoryName: any, transaction: Transaction) {
		var exists = this.findWhere({catName: categoryName});
		if (exists) {
			exists.set('count',  exists.get('count') + 1, { silent: true });
			let amountBefore = exists.get('amount');
			let amountAfter = transaction.get('amount');
			if (categoryName == 'Income') {
				//console.log(amountBefore, amountAfter, amountBefore + amountAfter);
			}
			exists.set('amount', amountBefore + amountAfter, { silent: true });
		} else {
			this.add({
				catName: categoryName,
				count: 1,
				amount: transaction.get('amount'),
			}, { silent: true });
		}
	}

	change() {
		console.log('CategoryCollection.change');
		this.getCategoriesFromExpenses();
	}

	getOptions() {
		var options = [];
		this.forEach((value: CategoryCount) => {
			options.push(value.get('catName'));
		});
		options = _.sortBy(options);
		return options;
	}

}
