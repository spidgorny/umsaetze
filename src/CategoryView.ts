///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>

import Expenses from "./Expenses";
import Transaction from "./Transaction";
import CategoryCollection from "./CategoryCollection";
import CategoryCount from "./CategoryCount";

export default class CategoryView extends Backbone.View<CategoryCollection> {

	model: CategoryCollection;

	template = _.template($('#categoryTemplate').html());

	constructor(options) {
		super(options);
		this.setElement($('#categories'));
	}

	render() {
		var content = [];
		var categoryCount = this.model.getCategoryCount();
		var sum: number = <number>_.reduce(categoryCount,
			(memo, item: CategoryCount) => {
				// only expenses
				if (item.catName != 'Default' && item.amount < 0) {
					return memo + item.amount;
				} else {
					return memo;
				}
			}, 0);
		//console.log('sum', sum);

		categoryCount = _.sortBy(categoryCount, (el: CategoryCount) => {
			return -el.amount;
		}).reverse();

		_.each(categoryCount, (catCount: CategoryCount) => {
			if (catCount.catName != 'Default' && catCount.amount < 0) {
				var width = Math.round(100 * (-catCount.amount) / -sum) + '%';
				//console.log(catCount.catName, width, catCount.count, catCount.amount);
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
		console.log('model changed', this.model);
		if (this.model) {
			this.model.change();
			this.render();
		} else {
			console.error('Not rendering since this.model is undefined');
		}
	}

}
