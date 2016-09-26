import Transaction from "../Transaction";
import CategoryCount from "./CategoryCount";
import Expenses from "../Expenses";
let elapse = require('elapse');
elapse.configure({
	debug: true
});
const bb = require('backbone');
const bbls = require('backbone.localstorage');
const _ = require('underscore');

/**
 * Depends on Expenses to parse them
 * and retrieve the total values for each category
 */
export default class CategoryCollection extends bb.Collection<CategoryCount> {

	model: CategoryCount|any;

	//collection: Backbone.Collection<CategoryCount>;

	expenses: Expenses;

	constructor(options?) {
		super(options);
		let ls = new bbls('Categories');
		//this.colors = simpleStorage.get('CategoryColors');
		let models = ls.findAll();
		//console.log('categories in LS', models);

		//this.add(models);	// makes Backbone.Model instances
		_.each(models, m => {
			this.add(new CategoryCount(m));
		});

		// sort
		this.models = _.uniq(this.models, (el) => {
			return el.getName();
		});
		this.sortBy('catName');

		if (!this.size()) {
			//this.getCategoriesFromExpenses();
			// this is not available yet
		}

		this.listenTo(this, 'change', this.saveToLS);
	}

	setExpenses(ex: Expenses) {
		this.expenses = ex;
		this.getCategoriesFromExpenses();

		// when expenses change, we recalculate our data
		// visibility changes are too often - commented
		//this.listenTo(this.expenses, "change", this.getCategoriesFromExpenses);

		// this is how AppView triggers recalculation
		// this makes an infinite loop of triggers
		//this.listenTo(this, "change", this.getCategoriesFromExpenses);
		//this.listenTo(this, 'add', this.addToOptions);
	}

	saveToLS() {
		let ls = new bbls('Categories');
		this.each((model: CategoryCount) => {
			if (model.get('id')) {
				ls.update(model);
			} else {
				ls.create(model);
			}
		});
	}

	resetCounters() {
		this.each((row: CategoryCount) => {
			row.set('amount', 0, { silent: true });
			row.set('count', 0, { silent: true });
		});
	}

	getCategoriesFromExpenses() {
		elapse.time('getCategoriesFromExpenses');
		// this.reset();	// don't reset - loosing colors
		this.resetCounters();
		let visible = this.expenses.getVisible();
		//console.log(visible.length);
		_.each(visible, (transaction: Transaction) => {
			let categoryName = transaction.get('category');
			if (categoryName) {
				this.incrementCategoryData(categoryName, transaction);
			}
		});
		//console.log(this.categoryCount);
		this.sortBy('amount');
		elapse.timeEnd('getCategoriesFromExpenses');

		// when we recalculated the data we trigger the view render
		this.trigger('change'); // commented because of infinite loop
	}

	private incrementCategoryData(categoryName: any, transaction: Transaction) {
		let exists = this.findWhere({catName: categoryName});
		if (exists) {
			exists.set('count',  exists.get('count') + 1, { silent: true });
			let amountBefore = exists.get('amount');
			let amountAfter = transaction.get('amount');
			if (categoryName == 'Income') {
				//console.log(amountBefore, amountAfter, amountBefore + amountAfter);
			}
			exists.set('amount', amountBefore + amountAfter, { silent: true });
		} else {
			this.add(new CategoryCount({
				catName: categoryName,
				count: 1,
				amount: transaction.get('amount'),
			}), { silent: true });
		}
	}

	getCategoriesFromExpenses2() {
		let options = [];
		let categories = this.expenses.groupBy('category');
		//console.log('categories', categories);
		_.each(categories, (value, index) => {
			options.push(index);
		});
		return options;
	}

	/**
	 * Run once and cache forever.
	 * Not using this.models because they are filtered only visible
	 * but we need all categories
	 * @returns {Array}
	 */
	getOptions() {
		let options = this.pluck('catName');
		//console.log('getOptions', options);
		options = _.unique(options);
		options = _.sortBy(options);
		return options;
	}

	getColorFor(value) {
		// console.log('colors', this.colors);
		// let index = _.find(this.allOptions, (catName, index) => {
		// 	if (value == catName) {
		// 		return index;
		// 	}
		// });
		let color;
		let category = this.findWhere({catName: value});
		if (category) {
			color = category.get('color');
			//console.log('color for', value, 'is', color);
		} else {
			color = '#AAAAAA';
		}
		return color;
	}

}