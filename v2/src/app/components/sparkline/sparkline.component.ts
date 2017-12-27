import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Chart} from 'chart.js';

@Component({
	selector: 'app-sparkline',
	templateUrl: './sparkline.component.html',
	styleUrls: ['./sparkline.component.css']
})
export class SparklineComponent implements OnInit {

	@Input() sparkLine;
	@Input() average;

	canvas: HTMLCanvasElement;

	constructor(protected element: ElementRef) {
	}

	ngOnInit() {
		this.canvas = this.element.nativeElement.querySelector('canvas');
		console.log(this.canvas);
		this.renderSparkLine();
	}

	values(object) {
		return Object.keys(object).map(key => object[key]);
	}

	private renderSparkLine() {
		const ctx = this.canvas.getContext('2d');

		// Build the data object
		const data = this.values(this.sparkLine);
		const labels = Object.keys(this.sparkLine);
		// console.log(data, labels);
		const datasets = {};

		// Create the dataset
		datasets['strokeColor'] = this.canvas.getAttribute('data-chart_StrokeColor');
		datasets['data'] = data;

		const lineSet = {
			type: 'line',
			label: 'Average per month',
			data: [].fill(this.average, 0, data.length),
			borderColor: '#FF0000',
			borderWidth: 1,
			fill: false,
		};

		// Add to data object
		const dataDesc = {};
		dataDesc['labels'] = labels;
		dataDesc['datasets'] = Array(datasets, lineSet);

		const catPage = this;
		const chart = new Chart.Line(ctx, {
			data: dataDesc,
			options: {
				responsive: true,
				scaleLineColor: 'rgba(0,0,0,0)',
				scaleShowLabels: false,
				scaleShowGridLines: false,
				pointDot: false,
				datasetFill: false,
				// Sadly if you set scaleFontSize to 0, chartjs crashes
				// Instead we'll set it as small as possible and make it transparent
				scaleFontSize: 1,
				scaleFontColor: 'rgba(0,0,0,0)',
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
					// catPage.clickOnChart(labels, event, aChartElement, this);
				}
			}
		});
	}

/*
	private clickOnChart(labels, event: MouseEvent, aChartElement, chart) {
		const catPage = this;
		const first = aChartElement.length ? aChartElement[0] : null;
		if (first) {
			console.log(labels, aChartElement);
			const yearMonth = labels[first._index];
			const [year, month] = yearMonth.split('-');
			const categoryID = $(event.target).closest('tr').attr('data-id');
			const category: CategoryCount = catPage.categoryList.get(categoryID);
			console.log(yearMonth, year, month, category);
			Backbone.history.navigate('#/' + year + '/' + month + '/' + category.get('catName'));
		} else {
			console.log(this, event, event.target);
			const $canvas = $(event.target);
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
*/

}
