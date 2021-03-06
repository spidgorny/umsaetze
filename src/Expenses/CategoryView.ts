import CategoryCollection from "../Category/CategoryCollection";
import CategoryCount from "../Category/CategoryCount";
import Expenses from "./Expenses";
import * as _ from 'underscore';
import $ from 'jquery';
import {Chart} from 'chart.js';
import {debug} from '../main';
import CategoryCollectionModel from "../Category/CategoryCollectionModel";
import {CurrentMonth} from "../MonthSelect/CurrentMonth";
// import elapse from 'elapse';
import Backbone = require('backbone');

/**
 * Sidebar category pie-chart and list
 */
export default class CategoryView extends Backbone.View<CategoryCollectionModel> {

	model: CategoryCollectionModel;

	categories: CategoryCollection;

	currentMonth: CurrentMonth;

	expenses: Expenses;

	template = _.template($('#categoryTemplate').html());

	myPieChart: Chart;

	private INCOME_CATEGORY: string = 'Income';

	constructor(options: any, currentMonth: CurrentMonth, expenses: Expenses) {
		super(options);
		this.categories = this.model.getCollection();
		// update when month changes
		this.categories.on('change', this.render.bind(this));

		this.currentMonth = currentMonth;

		this.setElement($('#categories'));

		// this is now handled better by MonthSelectCategory
		// this.$el
		// 	.off('click')
		// 	.on('click', 'a.filterByCategory', this.filterByCategory.bind(this));

		this.on("all", () => {
			debug("CategoryView")
		});

		this.expenses = expenses;
		this.listenTo(this.expenses, 'change', this.recalculate.bind(this));
		// this.listenTo(this, 'Transaction:change', this.recalculate);
	}

	/**
	 * Triggered on change in expenses
	 */
	recalculate() {
		console.warn('CategoryView.recalculate');
		this.model.getCollection().getCategoriesFromExpenses();
		// should call render?
	}

	render() {
		console.time('CategoryView.render');
		let categoryCount = this.categories.toJSON();
		console.log('categoryCount', categoryCount.length);

		// remove income from %
		let incomeRow: any = _.findWhere(categoryCount, {
			catName: this.INCOME_CATEGORY,
		});
		console.log('incomeRow', incomeRow);
		categoryCount = _.without(categoryCount, incomeRow);

		let sum: number = <number>_.reduce(categoryCount,
			(memo, item: CategoryCount) => {
				// only expenses
				return memo + Math.abs(item.amount);
			}, 0);
		//console.log('sum', sum);

		const content = this.renderTableRows(categoryCount, sum);
		this.$('#catElements').html(content.join('\n'));
		if (!incomeRow) {
			incomeRow = { amount: 0 };
		}
		this.$('.income').html(
			incomeRow.amount.toFixed(2));
		this.$('.total').html(
			sum.toFixed(2));

		this.showPieChart(Math.abs(sum));

		console.timeEnd('CategoryView.render');
		return this;
	}

	renderTableRows(categoryCount: CategoryCount[], sum: number) {
		categoryCount = _.sortBy(categoryCount, (el: CategoryCount) => {
			return Math.abs(el.amount);
		}).reverse();

		let content = [];
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
					color: catCount.color,
					id: catCount.id,
					catName: catCount.catName,
					count: catCount.count,
					linkToCategory: this.currentMonth.getURL() + '/'
						+ catCount.catName,
				})
			));
		});
		return content;
	}

	/**
	 * @deprecated
	 * @private
	 */
	_change() {
		console.log('CategoryView changed', this.model.getCollection().size());
		if (this.model) {
			//console.log('Calling CategoryCollection.change()');
			//this.model.change();	// called automagically
			this.render();
		} else {
			console.error('Not rendering since this.model is undefined');
		}
	}

	showPieChart(sum) {
		let labels = [];
		let colors = [];
		let dataSet1 = [];
		// console.log(this.model);
		if (this.model) {
			this.model.getCollection().comparator = function (el: CategoryCount) {
				return -Math.abs(el.getAmountFloat());
			};
		}
		this.model.getCollection().sort();

		let rest = 0;
		this.model.getCollection().each((cat: CategoryCount) => {
			if (cat.getName() != 'Income') {
				let amount = Math.abs(cat.getAmountFloat());
				let perCent = 100 * amount / sum;
				if (perCent > 3) {
					labels.push(cat.get('catName'));
					dataSet1.push(amount);
					colors.push(cat.get('color'));
				} else {
					rest += amount;
				}
			}
		});
		labels.push('Rest');
		dataSet1.push(rest.toFixed(2));

		let data = {
			labels: labels,
			datasets: [
				{
					data: dataSet1,
					backgroundColor: colors,
					hoverBackgroundColor: colors,
				}
			]
		};
		if (this.myPieChart) {
			this.myPieChart.destroy();
		}
		this.myPieChart = new Chart(
			document.getElementById('pieChart'), {
			type: 'pie',
			data: data,
			options: {
				legend: {
					display: false,
				},
				animation: false,
			}
		});
	}

	filterByCategory(event: MouseEvent) {
		event.preventDefault();
		let link = $(event.target);
		let id = link.attr('data-id');
		console.log('filterByCategory', id);
		let cat = this.model.get(id);
		//console.log(cat);
		//this.expenses.filterByMonth();
		if (cat) {
			this.expenses.setAllVisible();
			this.expenses.filterByMonth(this.currentMonth.getSelected());
			this.expenses.filterByCategory(cat);
		} else {
			this.expenses.setAllVisible();
			this.expenses.filterByMonth(this.currentMonth.getSelected());
		}
		this.expenses.trigger('change');	// slow!
	}

	hide() {
		this.$el.hide();
		$('#pieChart').hide();
	}

	show() {
		this.$el.show();
		$('#pieChart').show();
	}

}
