///<reference path="../../typings/index.d.ts"/>
///<reference path="../../node_modules/backbone-typings/backbone.d.ts"/>

import MyView from "./MyView";
import Expenses from "../Expenses/Expenses";
import MonthSelect from "../MonthSelect";
import Transaction from "../Expenses/Transaction";
const Handlebars = require('handlebars');
const Backbone: any = require('backbone');
const _ = require('underscore');
const Chart = require('chart.js');
require('datejs');

export default class HistoryView extends Backbone.View<Backbone.Model> {

	collection: Expenses;

	ms: MonthSelect;

	template: Function;

	constructor(options) {
		super(options);
		this.collection = options.collection;
		this.setElement($('#app'));

		this.ms = MonthSelect.getInstance();
		this.ms.earliest = this.collection.getEarliest();
		this.ms.latest = this.collection.getLatest();
		this.ms.show();
		this.listenTo(this.ms, 'MonthSelect:change', this.monthChange.bind(this));

		this.template = _.template('<canvas width="1024" height="256" ' +
			'class="sparkline" ' +
			'style="width: 1024px; height: 256px" '+
			'data-chart_StrokeColor="rgba(151,187,0,1)" '+
			'data-average="<%= average %>" '+
			'></canvas>');
	}

	render() {
		this.collection.setAllVisible();
		const yearMonth = this.ms.getSelected();
		this.collection.filterByMonth(yearMonth);
		const dataThisMonth = this.collection.getSorted();

		let accumulator = 0;
		let onlyMoney = dataThisMonth.map((set: Transaction) => {
			//console.log(set);
			accumulator += set.get('amount');
			return accumulator;
		});

		let labels = dataThisMonth.map((set: Transaction) => {
			let date: IDateJS = set.get('date');
			return date.toString('yyyy.MM.dd');
		});
		let labelMoney = _.object(labels, onlyMoney);

		let content = '';
		content += this.template({
			average: onlyMoney.average(),
		});
		content += '<pre>' + JSON.stringify(dataThisMonth, null, 4) + '</pre>';
		this.$el.html(content);

		this.renderSparkLines(labelMoney);

		return this;
	}

	hide() {
		this.stopListening(this.ms);
	}

	monthChange() {
		//console.error('monthChange event');
		this.render();
	}

	private renderSparkLines(chartData) {
		let $sparkline = $('.sparkline');
		$sparkline.each((index, self) => {
			//console.log($self);
			let $self = $(self);
			//Get context with jQuery - using jQuery's .get() method.
			let ctx = $self.get(0).getContext("2d");

			// Get the chart data and convert it to an array
			let average = $self.attr('data-average');

			// Build the data object
			let data = Object.values(chartData);
			let labels = Object.keys(chartData);
			//console.log(data, labels);
			let datasets = {};

			// Create the dataset
			datasets['strokeColor'] = $self.attr('data-chart_StrokeColor');
			datasets['data'] = data;

			let lineset = {
				type: 'line',
				label: 'Average per month',
				data: Array(data.length).fill(average),
				borderColor: '#FF0000',
				borderWidth: 1,
				fill: false,
			};

			// Add to data object
			let dataDesc = {};
			dataDesc['labels'] = labels;
			dataDesc['datasets'] = Array(datasets, lineset);

			let chart = new Chart.Line(ctx, {
				data: dataDesc,
				options: {
					responsive: false,
					responsiveAnimationDuration: 0,
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
					maintainAspectRatio: true,
					scales: {
						yAxes: [{
							ticks: {
								padding: 0,
							}
						}]
					},
					onClick: (event: MouseEvent, aChartElement) => {
						this.clickOnChart(labels, event, aChartElement, this);
					}
				}
			});
			$self.prop('chart', chart);

			// $self.width('100%');
			// $self.height(256);
		});
	}

	clickOnChart(labels, event, aChart, context) {

	}

}
