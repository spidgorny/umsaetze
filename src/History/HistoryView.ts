///<reference path="../../typings/index.d.ts"/>
///<reference path="../../node_modules/backbone-typings/backbone.d.ts"/>

import MyView from "./MyView";
import Expenses from "../Expenses/Expenses";
import MonthSelect from "../MonthSelect";
import Transaction from "../Expenses/Transaction";
import {default as SLTable} from "../Util/SLTable";
const Handlebars = require('handlebars');
const Backbone: any = require('backbone');
const _ = require('underscore');
const Chart = require('chart.js');
require('datejs');
require('../Util/Array');

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

		this.template = _.template('<canvas width="1500" height="512" ' +
			'class="sparkline" ' +
			'style="width: 1500px; height: 512px" '+
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
		console.log('yearMonth', yearMonth);
		this.collection.filterByMonth(yearMonth);
		this.collection.stepBackTillSalary(this.ms);
		const dataThisMonth = this.collection.getSorted();

		let onlyAmounts: Array<number> = dataThisMonth.map((set: Transaction) => {
			return set.get('amount');
		});

		let accumulator = 0;
		let cumulative = dataThisMonth.map((set: Transaction) => {
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
			average: onlyAmounts.average(),
		});

		content += new SLTable(JSON.parse(JSON.stringify(dataThisMonth)));

		//content += '<pre>' + JSON.stringify(dataThisMonth, null, 4) + '</pre>';
		this.$el.html(content);

		this.renderSparkLines(labels, onlyAmounts, cumulative);

		return this;
	}

	hide() {
		this.stopListening(this.ms);
	}

	monthChange() {
		//console.error('monthChange event');
		this.render();
	}

	private renderSparkLines(labels: Array<string>, data: Array<number>, data2: Array<number>) {
		let $sparkLine = $('.sparkline');
		$sparkLine.each((index, self) => {
			//console.log($self);
			let $self = $(self);
			//Get context with jQuery - using jQuery's .get() method.
			let ctx = (<HTMLCanvasElement>$self.get(0)).getContext("2d");

			let datasets = {};

			// Create the dataset
			datasets['strokeColor'] = $self.attr('data-chart_StrokeColor');
			datasets['data'] = data2;

			let lineSet = {
				type: 'line',
				label: 'Transaction',
				data: data,
				borderColor: '#FF0000',
				borderWidth: 1,
				fill: false,
			};

			// Add to data object
			let dataDesc = {};
			dataDesc['labels'] = labels;
			dataDesc['datasets'] = Array(datasets, lineSet);

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
		// console.log(labels);
		// console.log(event);
		// console.log(aChart);
		// console.log(context);
		let any = aChart[0];
		let index = any._index;
		// console.log(index);
		let model = this.collection.getSorted()[index];
		let id = model.get('id');
		// console.log(id);
		$(window).scrollTop($("*:contains('" + id + "'):last").offset().top);
		document.location.hash = '#History/' + id;
	}

}
