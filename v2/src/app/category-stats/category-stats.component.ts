import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ExpensesService} from '../expenses.service';
import {CategoryList} from '../category-list';
import {CurrentMonthService} from '../current-month.service';
import {Transaction} from '../transaction';
import {Category} from '../category';
import {CategoryChartComponent} from '../category-chart/category-chart.component';

@Component({
	selector: 'app-category-stats',
	templateUrl: './category-stats.component.html',
	styleUrls: ['./category-stats.component.css']
})
export class CategoryStatsComponent implements OnInit {

	visible: Transaction[];

	@ViewChild('chart') chart: CategoryChartComponent;

	constructor(protected categories: CategoryList,
				protected expenses: ExpensesService,
				protected currentMonth: CurrentMonthService) {
		this.currentMonth.subscribe(this.update.bind(this));
	}

	get income() {
		const income = this.categories.data.get(CategoryList.INCOME);
		// console.log(this.categories.data.keys());
		// console.log(CategoryList.INCOME, income);
		return income ? income.amount : 0;
	}

	get total() {
		return this.expenses.getTotal(this.visible);
	}

	ngOnInit() {
	}

	get data() {
		return this.categories.getData().sort((c1: Category, c2: Category) => {
			return c1.amount === c2.amount
				? 0
				: (c1.amount > c2.amount) ? 1 : -1;
		});
	}

	/**
	 * Re-render when something changes
	 */
	update() {
		console.profile('CategoryStatsController::update()');
		this.visible = this.expenses.getVisible(this.currentMonth);
		this.categories.setCategoriesFromExpenses(this.visible);
		this.categories.setTotal(parseFloat(this.total));

		if (this.chart) {
			this.chart.rerender();
		} else {
			console.error('Chart not set');
		}
		console.profileEnd();
	}

}
