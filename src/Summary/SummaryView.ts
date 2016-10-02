///<reference path="../../typings/index.d.ts"/>
///<reference path="../../node_modules/backbone-typings/backbone.d.ts"/>

import CategoryCollection from "../Category/CategoryCollection";
import CategoryCount from "../Category/CategoryCount";
import Expenses from "../Expenses";
const Handlebars = require('handlebars');
const Backbone: any = require('backbone');
const _ = require('underscore');

export default class SummaryView extends Backbone.View<CategoryCollection> {

	collection: CategoryCollection;

	expenses: Expenses;

	template: any;

	constructor(options, expenses: Expenses) {
		super(options);
		this.expenses = expenses;
		this.setElement($('#app'));
		let importTag = $('#SummaryPage');	// <import>
		let href = importTag.prop('href');
		console.log(importTag, href);
		$.get(href).then((result) => {
			//console.log(result);
			this.template = Handlebars.compile(result);
			this.render();
		});
	}

	render() {
		if (!this.template) {
			this.$el.html('Loading...');
			return this;
		}

		let months = [];
		let categoryOptions = [];
		this.collection.each((category: CategoryCount) => {
			let monthlyTotals = this.expenses.getMonthlyTotalsFor(category);
			let averageAmountPerMonth = category.getAverageAmountPerMonth(monthlyTotals);
			months = Object.keys(monthlyTotals);
			categoryOptions.push({
				catName: category.get('catName'),
				background: category.get('color'),
				id: category.cid,
				average: averageAmountPerMonth,
				perMonth: monthlyTotals,
			});
		});
		categoryOptions = _.sortBy(categoryOptions, 'catName');
		this.$el.html(this.template({
			categoryOptions: categoryOptions,
			count: this.collection.size(),
			months: months,
		}));

		return this;
	}

}
