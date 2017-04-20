///<reference path="../../typings/index.d.ts"/>
///<reference path="../../node_modules/backbone-typings/backbone.d.ts"/>

import MyView from "./MyView";
import Expenses from "../Expenses/Expenses";
import MonthSelect from "../MonthSelect";
import Transaction from "../Expenses/Transaction";
import slTable from "../Util/slTable";
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
		this.ms.update(this.collection);
		this.listenTo(this.ms, 'MonthSelect:change', this.monthChange.bind(this));

		this.template = _.template('<canvas width="1024" height="256" ' +
			'class="sparkline" ' +
			'style="width: 1024px; height: 256px" '+
			'data-chart_StrokeColor="rgba(151,187,0,1)" '+
			'data-average="<%= average %>" '+
			'></canvas>');

		// let nintendo = this.collection.findWhere({id: '6137a425c770c89cfd55d60f91448749'});
		// if (nintendo) {
		// 	nintendo.set('amount', 3714.69);
		// 	console.log(nintendo);
		// }
	}

	render() {
		this.collection.setAllVisible();
		const yearMonth = this.ms.getSelected();
		this.collection.filterByMonth(yearMonth);
		this.collection.stepBackTillSalary();
		const dataThisMonth = this.collection.getSorted();

		let accumulator = 0;
		let onlyMoney = dataThisMonth.map((set: Transaction) => {
			accumulator += set.get('amount');
			//console.log(set.get('amount'), accumulator);
			return accumulator;
		});

		let labels = dataThisMonth.map((set: Transaction) => {
			let date: IDateJS = set.get('date');
			return date.toString('yyyy.MM.dd');
		});

		let content = '';
		content += this.template({
			average: onlyMoney.average(),
		});

		content += new slTable(JSON.parse(JSON.stringify(dataThisMonth)));

		content += '<pre>' + JSON.stringify(dataThisMonth, null, 4) + '</pre>';
		this.$el.html(content);

		this.renderSparkLines(labels, onlyMoney);

		return this;
	}

	hide() {
		this.stopListening(this.ms);
	}

	monthChange() {
		//console.error('monthChange event');
		this.render();
	}

	private renderSparkLines(labels: Array, data: Array) {
		let $sparkline = $('.sparkline');
		$sparkline.each((index, self) => {
			//console.log($self);
			let $self = $(self);
			//Get context with jQuery - using jQuery's .get() method.
			let ctx = $self.get(0).getContext("2d");

			// Get the chart data and convert it to an array
			let average = $self.attr('data-average');

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
