///<reference path="../../node_modules/backbone-typings/backbone.d.ts"/>

import CategoryCollection from "./CategoryCollection";
import CategoryCount from "./CategoryCount";
import Expenses from "../Expenses";
let elapse = require('elapse');
elapse.configure({
	debug: true
});
const Backbone = require('backbone');
const _ = require('underscore');
const $ = require('jquery');
const Chart = require('chart.js');

export default class CategoryView extends Backbone.View<CategoryCollection> {

	model: CategoryCollection;

	expenses: Expenses;

	template = _.template($('#categoryTemplate').html());

	myPieChart;

	constructor(options) {
		super(options);
		this.setElement($('#categories'));
		this.listenTo(this.model, 'change', this.render);
		this.$el.on('click', 'a.filterByCategory', this.filterByCategory.bind(this));
	}

	setExpenses(expenses) {
		this.expenses = expenses;
	}

	render() {
		elapse.time('CategoryView.render');
		let content = [];
		let categoryCount = this.model.toJSON();
		let sum: number = <number>_.reduce(categoryCount,
			(memo, item: CategoryCount) => {
				// only expenses
				return memo + Math.abs(item.amount);
			}, 0);
		//console.log('sum', sum);

		categoryCount = _.sortBy(categoryCount, (el: CategoryCount) => {
			return Math.abs(el.amount);
		}).reverse();

		_.each(categoryCount, (catCount: CategoryCount) => {
			let width = Math.round(
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
		this.$el.append('<div class="category text-right">' +
			'<a href="#" class="filterByCategory">Total</a>: '+sum.toFixed(2)+' &euro;'+
		'</div>');

		this.showPieChart();

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

	showPieChart() {
		let labels = [];
		let data = [];
		let colors = [];
		this.model.each((cat: CategoryCount) => {
			labels.push(cat.get('catName'));
			data.push(Math.abs(cat.getAmount()));
			colors.push(cat.get('color'));
		});
		let data = {
			labels: labels,
			datasets: [
				{
					data: data,
					backgroundColor: colors,
					hoverBackgroundColor: colors,
				}
			]
		};
		if (this.myPieChart) {
			this.myPieChart.destroy();
		}
		this.myPieChart = new Chart(document.getElementById('pieChart'), {
			type: 'pie',
			data: data,
			options: {
				legend: {
					display: false,
				}
			}
		});
	}

	filterByCategory(event: MouseEvent) {
		event.preventDefault();
		let link = $(event.target);
		let id = link.attr('data-id');
		console.error('filterByCategory', id);
		let cat = this.model.get(id);
		//console.log(cat);
		//this.expenses.filterByMonth();
		if (cat) {
			this.expenses.setAllVisible();
			this.expenses.filterByMonth();
			this.expenses.filterByCategory(cat);
		} else {
			this.expenses.setAllVisible();
			this.expenses.filterByMonth();
		}
		this.expenses.trigger('change');	// slow!
	}

}
