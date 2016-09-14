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

	allOptions = [];

	constructor(options?) {
		super(options);
	}

	setExpenses(ex: Expenses) {
		this.expenses = ex;
		this.getOptions();

		// when expenses change, we recalculate our data
		this.listenTo(this.expenses, "change", this.getCategoriesFromExpenses);

		// this is how AppView triggers recalculation
		// this makes an infinite loop of triggers
		this.listenTo(this, "change", this.getCategoriesFromExpenses);
		this.listenTo(this, 'add', this.addToOptions);
	}

	getCategoriesFromExpenses() {
		elapse.time('getCategoriesFromExpenses');
		this.reset();
		let visible = this.expenses.getVisible();
		_.each(visible, (transaction: Transaction) => {
			var categoryName = transaction.get('category');
			if (categoryName) {
				this.incrementCategoryData(categoryName, transaction);
			}
		});
		//console.log(this.categoryCount);
		elapse.timeEnd('getCategoriesFromExpenses');

		// when we recalculated the data we trigger the view render
		//this.trigger('change'); // commented because of infinite loop
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

	triggerChange() {
		console.log('CategoryCollection.triggerChange');
		// commented as next line will call it anyway
		//this.getCategoriesFromExpenses();
		this.trigger('change');
	}

	/**
	 * Run once and cache forever.
	 * Not using this.models because they are filtered only visible
	 * but we need all categories
	 * @returns {Array}
	 */
	getOptions() {
		if (!this.allOptions.length) {
			var options = [];
			var categories = this.expenses.groupBy('category');
			//console.log('categories', categories);
			_.each(categories, (value, index) => {
				options.push(index);
			});
			options = _.unique(options);
			options = _.sortBy(options);
			this.allOptions = options;
		}
		return this.allOptions;
	}

	addToOptions(model: CategoryCount) {
		console.log('addToOptions', model);
		this.allOptions.push(model.get('catName'));
		this.allOptions = _.unique(this.allOptions);
		this.allOptions = _.sortBy(this.allOptions);
		this.triggerChange();
	}

}
