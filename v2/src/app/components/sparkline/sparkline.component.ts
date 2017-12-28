import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Chart} from 'chart.js';
import {Router} from '@angular/router';

@Component({
	selector: 'app-sparkline',
	templateUrl: './sparkline.component.html',
	styleUrls: ['./sparkline.component.css']
})
export class SparklineComponent implements OnInit {

	@Input() sparkLine;
	@Input() average;
	@Input() categoryName;

	canvas: HTMLCanvasElement;
	chart: Chart;

	constructor(protected element: ElementRef,
				protected router: Router) {
	}

	ngOnInit() {
		this.canvas = this.element.nativeElement.querySelector('canvas');
		// console.log(this.canvas);
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
		const dataSets = {};

		// Create the dataSet
		dataSets['strokeColor'] = this.canvas.getAttribute('data-chart_StrokeColor');
		dataSets['data'] = data;

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
		dataDesc['datasets'] = Array(dataSets, lineSet);

		this.canvas.style.display = 'block';
		this.canvas.parentElement.style.display = 'block';
		this.chart = new Chart.Line(ctx, {
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
				animation: false,
				onClick: (event: MouseEvent, aChartElement) => {
					this.clickOnChart(labels, event, aChartElement, this);
				}
			}
		});
		// console.log(this);
	}

	/**
	 * https://stackoverflow.com/questions/18663941/finding-closest-element-without-jquery
	 * @param el
	 * @param tag
	 * @returns {any}
	 */
	getClosest(el, tag) {
		// this is necessary since nodeName is always in upper case
		tag = tag.toUpperCase();
		do {
			if (el.nodeName === tag) {
				// tag name is found! let's return it. :)
				return el;
			}
		} while (el = el.parentNode);

		// not found :(
		return null;
	}

	private clickOnChart(labels, event: MouseEvent, aChartElement, self) {
		// console.log(aChartElement, self);
		// click on the value dot
		const first = aChartElement.length ? aChartElement[0] : null;
		if (first) {
			console.log(labels, aChartElement);
			const yearMonth = labels[first._index];
			const [year, month] = yearMonth.split('-');
			console.log(yearMonth, year, month, this.categoryName);

			// TODO
			// this.router.navigateByUrl('/' + year + '/' + month + '/' + this.categoryName);
		} else {
			// console.log(this, event, event.target);
			console.log(this.canvas.offsetHeight);
			if (this.canvas.offsetHeight === 100) {
				// this.canvas.style.height = '300px';
			} else {
				// this.canvas.style.height = '100px';
			}
			setTimeout(() => {
				// self.chart.resize();
			}, 1000);
		}
	}

}
