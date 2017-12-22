import {Component, OnInit} from '@angular/core';
import {ExpensesService} from '../expenses.service';
import {CategoryList} from '../category-list';
import {CurrentMonthService} from '../current-month.service';
import {Transaction} from '../transaction';

@Component({
	selector: 'app-category-stats',
	templateUrl: './category-stats.component.html',
	styleUrls: ['./category-stats.component.css']
})
export class CategoryStatsComponent implements OnInit {

	INCOME = 'Income';

	visible: Transaction[];

	constructor(protected categories: CategoryList,
				protected expenses: ExpensesService,
				protected currentMonth: CurrentMonthService) {
		this.currentMonth.subscribe(this.update.bind(this));
	}

	get income() {
		const income = this.categories.data[this.INCOME];
		return income ? income.amount : 0;
	}

	get total() {
		return this.visible.reduce((acc, tr: Transaction) => {
			if (tr.category != this.INCOME) {
				return acc + tr.amount;
			}
			return acc;
		}, 0).toFixed(2);
	}

	ngOnInit() {
	}

	get data() {
		return this.categories.getData();
	}

	/**
	 * Re-render when something changes
	 */
	update() {
		this.visible = this.expenses.getVisible(this.currentMonth);
		this.categories.setCategoriesFromExpenses(this.visible);
		this.categories.setTotal(parseFloat(this.total));
	}

}
