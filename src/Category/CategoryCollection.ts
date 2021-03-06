import Transaction from "../Expenses/Transaction";
import CategoryCount from "./CategoryCount";
import Expenses from "../Expenses/Expenses";
import * as _ from 'underscore';
import {LocalStorage} from 'backbone.localstorage';
import {Collection} from "backbone";

const log = require('ololog');

/**
 * Depends on Expenses to parse them
 * and retrieve the total values for each category
 */
export default class CategoryCollection
	extends Collection<any|CategoryCount> {

	model: CategoryCount|any;

	models: CategoryCount[];

	//collection: Backbone.Collection<CategoryCount>;

	expenses: Expenses;

	_events;

	static readonly LS_KEY = 'Categories';

	constructor(models: any[]) {
		super();

		if (models.length) {
			models = _.uniq(models, false, (e1: CategoryCount) => {
				return e1.catName;
			});
			// log('unique categories in LS', models);

			//this.add(models);	// makes Backbone.Model instances
			_.each(models, m => {
				this.add(new CategoryCount(m));
			});
			// log('added as objects', this.models);

			// sort
			this.models = _.uniq(this.models, (el) => {
				return el.getName();
			});
			// log('unique objects', this.models);
		}

		if (!this.size()) {
			//this.getCategoriesFromExpenses();
			// this is not available yet
		}

		this.listenTo(this, 'change', this.saveToLS.bind(this));
	}

	get length() {
		return this.models.length;
	}

	initialize() {

	}

	fetch() {
		return <JQueryXHR>{};
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
		let ls = new LocalStorage(CategoryCollection.LS_KEY);
		let deleteMe = ls.findAll();
		// console.log('saveToLS', deleteMe.length);
		this.each((model: CategoryCount) => {
			if (model.get('id')) {
				ls.update(model);
				//deleteMe = _.without(deleteMe, _.findWhere(deleteMe, { id: model.get('id') }))
				let findIndex = _.findIndex(deleteMe, { id: model.get('id') });
				if (findIndex > -1) {
					deleteMe.splice(findIndex, 1);
				}
			} else {
				ls.create(model);
			}
		});
		if (deleteMe.length) {
			//console.log(deleteMe.length, _.pluck(deleteMe, 'id'), _.pluck(deleteMe, 'catName'));
			_.each(deleteMe, (el) => {
				ls.destroy(el);
			})
		}
	}

	resetCounters() {
		this.each((row: CategoryCount) => {
			row.set('amount', 0, { silent: true });
			row.set('count', 0, { silent: true });
		});
	}

	/**
	 * This is called when expenses change.
	 */
	getCategoriesFromExpenses() {
		console.time('CategoryCollection.getCategoriesFromExpenses');
		// this.reset();	// don't reset - loosing colors
		this.resetCounters();
		let visible = this.expenses.getVisible();
		//console.log(visible.length);
		_.each(visible, (transaction: Transaction) => {
			let categoryName = transaction.get('category');
			if (categoryName) {
				if (_.isObject(categoryName)) {
					// after import from FinAPI
					categoryName = categoryName.name;
				}
				this.incrementCategoryData(categoryName, transaction);
			}
		});
		//console.log(this.categoryCount);
		this.sortBy('amount');

		// when we recalculated the data we trigger the view render
		console.warn('trigger CategoryCollection change', this._events);
		this.trigger('change'); // commented because of infinite loop

		console.timeEnd('CategoryCollection.getCategoriesFromExpenses');
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

	/**
	 * @deprecated - attempt #2 - not finished
	 * @returns {Array}
	 */
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

	exists(newName) {
		return !!this.findWhere({
			catName: newName,
		});
	}

	/**
	 * @returns CategoryCount
	 */
	random() {
		return _.sample(this.models);
	}

	addCategory(newName: string) {
		if (!this.exists(newName)) {
			this.add(new CategoryCount({
				catName: newName
			}));
		}
	}

}
