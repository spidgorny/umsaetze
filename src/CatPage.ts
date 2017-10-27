import Expenses from './Expenses/Expenses';
import Transaction from './Expenses/Transaction';
import CategoryCollection from './Category/CategoryCollection';
import CategoryCount from './Category/CategoryCount';
import {CollectionController} from './CollectionController';
import Handlebars from 'handlebars';
// import Backbone from 'backbone-es6/src/Backbone.js';
import Backbone = require('backbone');
import * as $ from 'jquery';
import * as _ from 'underscore';
import Chart from 'chart.js';
import toastr from 'toastr';
import './Util/Object';

export class CatPage extends CollectionController<Expenses> {

	$el = $('#app');

	model: Transaction;

	collection: Expenses;

	categoryList: CategoryCollection;

	template;

	constructor(expenses: Expenses, categoryList: CategoryCollection) {
		super({});
		console.log('CatPage.constructor');
		this.collection = expenses;
		this.categoryList = categoryList;
		let importTag = $('#CatPage');
		let href = importTag.prop('href');
		console.log(importTag, href);
		$.get(href).then((result) => {
			//console.log(result);
			this.setTemplate(
				//_.template( result )
				Handlebars.compile(result)
			);
		});
		console.log(this);
		this.listenTo(this.categoryList, 'change', this.render);
		this.listenTo(this.categoryList, 'add', this.render);
		this.listenTo(this.categoryList, 'update', this.render);
	}

	setTemplate(html) {
		this.template = html;
		this.render();
	}

	render() {
		if (window.location.hash != '#CatPage') return;
		console.log('CatPage.render');
		if (this.template) {
			let categoryOptions = [];
			this.categoryList.each((category: CategoryCount) => {
				//console.log(category);
				let monthlyTotals = this.collection.getMonthlyTotalsFor(category);
				category.resetCounters();
				let averageAmountPerMonth = category.getAverageAmountPerMonth(monthlyTotals);
				categoryOptions.push({
					catName: category.get('catName'),
					background: category.get('color'),
					id: category.cid,
					used: category.get('count'),
					amount: averageAmountPerMonth,
					average: averageAmountPerMonth,
					sparkline: JSON.stringify(monthlyTotals),
				});
			});
			categoryOptions = _.sortBy(categoryOptions, 'catName');
			this.$el.html(this.template({
				categoryOptions: categoryOptions,
			}));
			this.$('#addCategoryForm').on('submit', this.addCategory.bind(this));
			if ($(document).scrollTop() < 1) {
				this.$('input[name="newName"]').focus();
			}
			this.$el.on('change', 'input[type="color"]', this.selectColor.bind(this));
			this.$('button.close').on('click', this.deleteCategory.bind(this));
			this.$('#categoryCount').html(this.categoryList.size().toString());
			this.$('.inlineEdit').data('callback', this.renameCategory.bind(this));
			setTimeout(() => {
				this.renderSparkLines();
			}, 5000);
		} else {
			this.$el.html('Loading...');
		}
		return this;
	}

	addCategory(event: Event) {
		event.preventDefault();
		let $form = $(event.target);
		let newName = $form.find('input').val();
		console.log('newName', newName);
		let categoryObject = new CategoryCount({
			catName: newName,
		});
		console.log('get', categoryObject.get('catName'));
		console.log('get', categoryObject.get('color'));
		this.categoryList.add(categoryObject);
	}

	selectColor(event) {
		console.log(event);
		let $input = $(event.target);
		let id = $input.closest('tr').attr('data-id');
		console.log('id', id);
		let category = this.categoryList.get(id);
		console.log('category by id', category);
		if (category) {
			//console.log('color', event.target.value);
			category.set('color', event.target.value);
		}
	}

	deleteCategory(event: MouseEvent) {
		let button = event.target;
		let tr = $(button).closest('tr');
		let id = tr.attr('data-id');
		console.log('deleteCategory', id);
		this.categoryList.remove(id);
	}

	/**
	 * https://codepen.io/ojame/pen/HpKvx
	 */
	private renderSparkLines() {
		let $sparkline = $('.sparkline');
		$sparkline.each((index, self) => {
			//console.log(self);
			const $self = $(self);
			//Get context with jQuery - using jQuery's .get() method.
			const canvas: HTMLCanvasElement = <HTMLCanvasElement>$self.get(0);
			let ctx = canvas.getContext("2d");

			// Get the chart data and convert it to an array
			let chartData = JSON.parse($self.attr('data-chart_values'));
			let average = $self.attr('data-average');

			// Build the data object
			let data = Object.values(chartData);
			let labels = Object.keys(chartData);
			//console.log(data, labels);
			let datasets = {};

			// Create the dataset
			datasets['strokeColor'] = $self.attr('data-chart_StrokeColor');
			datasets['data'] = data;

			let lineSet = {
				type: 'line',
				label: 'Average per month',
				data: [].fill(average, 0, data.length),
				borderColor: '#FF0000',
				borderWidth: 1,
				fill: false,
			};

			// Add to data object
			let dataDesc = {};
			dataDesc['labels'] = labels;
			dataDesc['datasets'] = Array(datasets, lineSet);

			let catPage = this;
			let chart = new Chart.Line(ctx, {
				data: dataDesc,
				options: {
					responsive: true,
					scaleLineColor: "rgba(0,0,0,0)",
					scaleShowLabels: false,
					scaleShowGridLines: false,
					pointDot: false,
					datasetFill: false,
					// Sadly if you set scaleFontSize to 0, chartjs crashes
					// Instead we'll set it as small as possible and make it transparent
					scaleFontSize: 1,
					scaleFontColor: "rgba(0,0,0,0)",
					legend: {
						display: false,
					},
					maintainAspectRatio: false,
					scales: {
						yAxes: [{
							ticks: {
								padding: 0,
							}
						}]
					},
					onClick: function (event: MouseEvent, aChartElement) {
						catPage.clickOnChart(labels, event, aChartElement, this);
					}
				}
			});
			$self.prop('chart', chart);
		});
	}

	private clickOnChart(labels, event: MouseEvent, aChartElement, chart) {
		let catPage = this;
		let first = aChartElement.length ? aChartElement[0] : null;
		if (first) {
			console.log(labels, aChartElement);
			let yearMonth = labels[first._index];
			let [year, month] = yearMonth.split('-');
			let categoryID = $(event.target).closest('tr').attr('data-id');
			let category: CategoryCount = catPage.categoryList.get(categoryID);
			console.log(yearMonth, year, month, category);
			Backbone.history.navigate('#/'+year+'/'+month+'/'+category.get('catName'));
		} else {
			console.log(this, event, event.target);
			let $canvas = $(event.target);
			if ($canvas.height() == 100) {
				$canvas.height(300);
			} else {
				$canvas.height(100);
			}
			setTimeout(() => {
				chart.resize();
			}, 1000);
		}
	}

	renameCategory(event, container, newName) {
		console.log('Rename', newName);
		let id = container.closest('tr').attr('data-id');
		let category: CategoryCount = this.categoryList.get(id);
		console.log(id, category);
		if (category) {
			let oldName = category.getName();
			if (this.categoryList.exists(newName)) {
				toastr.error('This category name is duplicate');
				container.find('span').text(oldName);
			} else {
				category.set('catName', newName);
				this.collection.replaceCategory(oldName, newName);
				this.categoryList.saveToLS();
			}
		}
	}

}
