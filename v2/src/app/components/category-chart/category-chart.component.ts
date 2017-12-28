import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Category} from '../../models/category';
import {CategoryList} from '../../services/category-list';
import {Chart} from 'chart.js';

@Component({
	selector: 'app-category-chart',
	templateUrl: './category-chart.component.html',
	styleUrls: ['./category-chart.component.css']
})
export class CategoryChartComponent implements OnInit, AfterViewInit {

	@Input() categories: CategoryList;
	myPieChart: Chart;

	constructor() {
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		this.draw(this.categories.getTotal());
	}

	rerender() {
		this.draw(this.categories.getTotal());
	}

	draw(sum: number) {
		const labels = [];
		const colors = [];
		const dataSet1 = [];

		let rest = 0;
		this.categories.getData().forEach((cat: Category) => {
			if (cat.name != CategoryList.INCOME) {
				const amount = Math.abs(cat.amount);
				const perCent = 100 * amount / sum;
				if (perCent > 3) {
					labels.push(cat.name);
					dataSet1.push(amount.toFixed(2));
					colors.push(cat.color);
				} else {
					rest += amount;
				}
			}
		});
		labels.push('Rest');
		dataSet1.push(rest.toFixed(2));

		const data = {
			labels: labels,
			datasets: [
				{
					data: dataSet1,
					backgroundColor: colors,
					hoverBackgroundColor: colors,
				}
			]
		};
		// console.log(labels, dataSet1);
		if (this.myPieChart) {
			this.myPieChart.destroy();
		}
		const canvas = document.getElementById('pieChart');
		// console.log(canvas, canvas.style.display);
		// console.log(canvas.parentElement);
		canvas.style.display = 'block';
		canvas.parentElement.style.display = 'block';
		this.myPieChart = new Chart(canvas, {
			type: 'pie',
			data: data,
			options: {
				legend: {
					display: false,
				},
				animation: {
					duration: 0
				},
			},
		});
	}

}
