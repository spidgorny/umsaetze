import {Component, OnInit} from '@angular/core';
import {ExpensesService} from '../expenses.service';
import {CategoryList} from '../category-list';
import {CurrentMonthService} from '../current-month.service';

@Component({
	selector: 'app-category-stats',
	templateUrl: './category-stats.component.html',
	styleUrls: ['./category-stats.component.css']
})
export class CategoryStatsComponent implements OnInit {

	constructor(protected categories: CategoryList, protected expenses: ExpensesService, protected currentMonth: CurrentMonthService) {

	}

	ngOnInit() {
	}

	get data() {
		this.categories.setCategoriesFromExpenses(this.expenses.getVisible(this.currentMonth));
		return this.categories.getData();
	}

}
