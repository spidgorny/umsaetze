import CategoryCollection from "../Category/CategoryCollection";
import CategoryCount from "../Category/CategoryCount";
import Expenses from "../Expenses/Expenses";
import SummaryLine from "./SummaryLine";
import CategoryCollectionModel from "../Category/CategoryCollectionModel";
import {ViewOptions} from "backbone";
import Handlebars from 'handlebars';
// import Backbone from 'backbone-es6/src/Backbone.js';
import Backbone = require('backbone');
import * as _ from 'underscore';
import $ from 'jquery';
import Controller from "../Controller";

export default class SummaryView extends Controller<CategoryCollectionModel> {

	/**
	 * CategoryCollection
	 */
	collection: Backbone.Collection<any>;

	expenses: Expenses;

	template: any;

	constructor(options: ViewOptions<CategoryCollectionModel>, expenses: Expenses) {
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

	initialize() {

	}

	show() {
		super.show();
		this.render();
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
		categoryOptions = this.addCategoryTotals(categoryOptions);
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
			categoryOptions.push(new SummaryLine({
				catName: category.getName(),
				background: category.get('color'),
				id: category.cid,
				average: averageAmountPerMonth,
				perMonth: monthlyTotals,
			}));
		});
		return categoryOptions;
	}

	private setPerCent(categoryOptions: SummaryLine[]) {
		let sumAverages = categoryOptions.reduce(function (current, b) {
			//console.log(current, b);
			return current + (typeof b.average == 'number'
				? b.average : parseFloat(b.average));
		}, 0);
		console.log('sumAverages', sumAverages);
		_.each(categoryOptions, (el) => {
			el.perCent = (el.average / sumAverages * 100).toFixed(2);
			//console.log(el.catName, el.perCent);
		});
		return categoryOptions;
	}

	private addCategoryTotals(categoryOptions: SummaryLine[]) {
		let groupByCategory = {};
		_.each(categoryOptions, (el: SummaryLine) => {
			if (!el.catName) {
				console.log(el);
				//throw new Error('addCategoryTotals has element without catName');
				return;	// ignore
			}
			let [category, specifics] = el.catName.split(':');
			category = category.trim();
			if (!groupByCategory[category]) {
				groupByCategory[category] = [];
			}
			groupByCategory[category].push(el);
		});
		console.log(groupByCategory);

		// step 2
		_.each(groupByCategory,
			(set: Array<SummaryLine>, setName) => {
			if (set.length > 1) {
				let newCat = new SummaryLine({
					catName: setName + ' [' + set.length + ']',
					background: '#FF8800',
				});
				_.each(set, (el: SummaryLine) => {
					newCat.combine(el);
				});
				newCat.sAverage = newCat.average.toFixed(2);
				newCat.perCent = typeof newCat.perCent == 'number'
					? newCat.perCent.toFixed(2) : newCat.perCent;
				categoryOptions.push(newCat);
			}
		});
		categoryOptions = _.sortBy(categoryOptions, 'catName');
		return categoryOptions;
	}

	/**
	 * For Workspace
	 */
	hide() {

	}

}
