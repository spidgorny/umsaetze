///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>

import Expenses from "./Expenses";
import Transaction from "./Transaction";

class CategoryCount {
	catName: String;
	count: number;
	amount: number;
}

export default class CategoryView extends Backbone.View<Expenses> {

	model: Expenses;

	categoryCount = [];

	template = _.template($('#categoryTemplate').html());

	constructor(options) {
		super(options);
		this.setElement($('#categories'));
		this.categoryCount = [];
	}

	render() {
		var content = [];
		var sum: number = <number>_.reduce(this.categoryCount,
			(memo, item: CategoryCount) => {
				// only expenses
				if (item.catName != 'Default' && item.amount < 0) {
					return memo + item.amount;
				} else {
					return memo;
				}
			}, 0);
		console.log('sum', sum);

		this.categoryCount = _.sortBy(this.categoryCount, (el: CategoryCount) => {
			return -el.amount;
		}).reverse();

		_.each(this.categoryCount, (catCount: CategoryCount) => {
			if (catCount.catName != 'Default' && catCount.amount < 0) {
				var width = Math.round(100 * (-catCount.amount) / -sum) + '%';
				console.log(catCount.catName, width, catCount.count, catCount.amount);
				content.push(this.template(
					_.extend(catCount, {
						width: width,
						amount: Math.round(catCount.amount),
					})
				));
			}
		});
		this.$el.html(content.join('\n'));
		return this;
	}

	change() {
		console.log('model changed', this.model.size());
		this.model.each((transaction: Transaction) => {
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
		this.render();
	}

}
