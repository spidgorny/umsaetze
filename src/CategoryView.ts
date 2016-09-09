///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>

import CategoryCollection from "./CategoryCollection";
import CategoryCount from "./CategoryCount";
var elapse = require('elapse');
elapse.configure({
	debug: true
});

export default class CategoryView extends Backbone.View<CategoryCollection> {

	model: CategoryCollection;

	template = _.template($('#categoryTemplate').html());

	constructor(options) {
		super(options);
		this.setElement($('#categories'));
		this.listenTo(this.model, 'change', this.render);
	}

	render() {
		elapse.time('CategoryView.render');
		var content = [];
		var categoryCount = this.model.toJSON();
		var sum: number = <number>_.reduce(categoryCount,
			(memo, item: CategoryCount) => {
				// only expenses
				return memo + item.amount;
			}, 0);
		//console.log('sum', sum);

		categoryCount = _.sortBy(categoryCount, (el: CategoryCount) => {
			return Math.abs(el.amount);
		}).reverse();

		_.each(categoryCount, (catCount: CategoryCount) => {
			var width = Math.round(
				100 * Math.abs(catCount.amount) / Math.abs(sum)
				) + '%';
			//console.log(catCount.catName, width, catCount.count, catCount.amount);
			content.push(this.template(
				_.extend(catCount, {
					width: width,
					amount: Math.round(catCount.amount),
					sign: catCount.amount >= 0 ? 'positive' : 'negative',
				})
			));
		});
		this.$el.html(content.join('\n'));
		elapse.timeEnd('CategoryView.render');
		return this;
	}

	/**
	 * @deprecated
	 * @private
	 */
	_change() {
		console.log('CategoryView changed', this.model.size());
		if (this.model) {
			//console.log('Calling CategoryCollection.change()');
			//this.model.change();	// called automagically
			this.render();
		} else {
			console.error('Not rendering since this.model is undefined');
		}
	}

}
