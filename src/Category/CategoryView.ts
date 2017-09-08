import CategoryCollection from "./CategoryCollection";
import CategoryCount from "./CategoryCount";
import Expenses from "../Expenses/Expenses";
import elapse from 'elapse';
import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import Chart from 'chart.js';
import {debug} from '../umsaetze';

elapse.configure({
	debug: true
});

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
		this.on("all", debug("CategoryView"));
	}

	setExpenses(expenses) {
		this.expenses = expenses;
		this.listenTo(this.expenses, 'change', this.recalculate);
	}

	recalculate() {
		console.warn('CategoryView.recalculate');
		this.model.getCategoriesFromExpenses();
		// should call render?
	}

	render() {
		elapse.time('CategoryView.render');
		let categoryCount = this.model.toJSON();

		// remove income from %
		let incomeRow = _.findWhere(categoryCount, {
			catName: 'Income',
		});
		categoryCount = _.without(categoryCount, incomeRow);

		let sum: number = <number>_.reduce(categoryCount,
			(memo, item: CategoryCount) => {
				// only expenses
				return memo + Math.abs(item.amount);
			}, 0);
		//console.log('sum', sum);

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
				})
			));
		});
		this.$('#catElements').html(content.join('\n'));
		if (!incomeRow) {
			incomeRow = { amount: 0 };
		}
		this.$('.income').html(incomeRow.amount.toFixed(2));
		this.$('.total').html(sum.toFixed(2));

		this.showPieChart(Math.abs(sum));

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

	showPieChart(sum) {
		let labels = [];
		let colors = [];
		let dataSet1 = [];
		this.model.comparator = function (el: CategoryCount) {
			return -Math.abs(el.getAmount());
		};
		this.model.sort();

		let rest = 0;
		this.model.each((cat: CategoryCount) => {
			if (cat.getName() != 'Income') {
				let amount = Math.abs(cat.getAmount());
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
		console.log('filterByCategory', id);
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

	hide() {
		this.$el.hide();
		$('#pieChart').hide();
	}

	show() {
		this.$el.show();
		$('#pieChart').show();
	}

}
