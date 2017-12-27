import {Component, OnInit} from '@angular/core';
import {CategoryList} from '../services/category-list';
import {Category} from '../models/category';
import {ExpensesService} from '../services/expenses.service';

@Component({
	selector: 'app-category-page',
	templateUrl: './category-page.component.html',
	styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent implements OnInit {

	constructor(protected categories: CategoryList,
				protected expenses: ExpensesService) {
	}

	ngOnInit() {
		this.categories.data.forEach((cat: Category) => {
			const totals = this.expenses.getMonthlyTotalsFor(cat);
			cat.averagePerMonth = cat.getAverageAmountPerMonth(totals);
			cat.sparkLine = totals;
		});
	}

	addNewCategory(newName: string) {

	}

}
