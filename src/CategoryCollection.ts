import Transaction from "./Transaction";
import CategoryCount from "./CategoryCount";
import Expenses from "./Expenses";
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
		console.log('categories in LS', models);
		this.add(models);
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
		this.listenTo(this.expenses, "change", this.getCategoriesFromExpenses);

		// this is how AppView triggers recalculation
		// this makes an infinite loop of triggers
		// this.listenTo(this, "change", this.getCategoriesFromExpenses);
		this.listenTo(this, 'add', this.addToOptions);
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

	getCategoriesFromExpenses() {
		elapse.time('getCategoriesFromExpenses');
		// this.reset();	// don't reset - loosing colors
		let visible = this.expenses.getVisible();
		_.each(visible, (transaction: Transaction) => {
			let categoryName = transaction.get('category');
			if (categoryName) {
				this.incrementCategoryData(categoryName, transaction);
			}
		});
		//console.log(this.categoryCount);
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
			this.add({
				catName: categoryName,
				count: 1,
				amount: transaction.get('amount'),
				color: CategoryCollection.pastelColor(),
			}, { silent: true });
		}
	}

	triggerChange() {
		console.log('CategoryCollection.triggerChange');
		// commented as next line will call it anyway
		//this.getCategoriesFromExpenses();
		this.trigger('change');
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

	addToOptions(model: CategoryCount) {
		console.log('addToOptions', model);
		this.allOptions.push(model.get('catName'));
		this.allOptions = _.unique(this.allOptions);
		this.allOptions = _.sortBy(this.allOptions);
		this.setColors();
		this.triggerChange();
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

	static pastelColor(){
		let r = (Math.round(Math.random() * 55) + 200).toString(16);
		let g = (Math.round(Math.random() * 55) + 200).toString(16);
		let b = (Math.round(Math.random() * 55) + 200).toString(16);
		return '#' + r + g + b;
	}

}
