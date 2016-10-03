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
		//console.log(importTag, href);
		$.get(href).then((result) => {
			//console.log(result);
			this.template = Handlebars.compile(result);
			//console.log(this.template);
			this.render();
		});
	}

	render() {
		if (!this.template) {
			this.$el.html('Loading...');
			return this;
		}
		let categoryOptions = this.getCategoriesWithTotals();
		let months = _.pluck(categoryOptions[0].perMonth, 'year-month');
		categoryOptions = this.setPerCent(categoryOptions);
		categoryOptions = _.sortBy(categoryOptions, 'catName');
		let content = this.template({
			categoryOptions: categoryOptions,
			count: this.collection.size(),
			months: months,
		});
		this.$el.html(content);

		return this;
	}

	private getCategoriesWithTotals() {
		let categoryOptions = [];
		this.collection.each((category: CategoryCount) => {
			let monthlyTotals = this.expenses.getMonthlyTotalsFor(category);
			let averageAmountPerMonth = category.getAverageAmountPerMonth(monthlyTotals);
			monthlyTotals = _.map(monthlyTotals, (el, key) => {
				let [year, month] = key.split('-');
				// console.log(key, year, month);
				return {
					'year-month': year+'-'+month,
					year: year,
					month: month,
					categoryName: category.getName(),
					value: el,
				}
			});
			categoryOptions.push({
				catName: category.getName(),
				background: category.get('color'),
				id: category.cid,
				average: averageAmountPerMonth,
				perMonth: monthlyTotals,
			});
		});
		return categoryOptions;
	}

	private setPerCent(categoryOptions: Array) {
		let sumAverages = categoryOptions.reduce(function (current, b) {
			//console.log(current, b);
			return current + parseFloat(b.average);
		}, 0);
		console.log('sumAverages', sumAverages);
		_.each(categoryOptions, (el) => {
			el.perCent = (el.average / sumAverages * 100).toFixed(2);
			//console.log(el.catName, el.perCent);
		});
		return categoryOptions;
	}

}
