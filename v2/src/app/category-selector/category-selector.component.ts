import {Component, Input, OnInit} from '@angular/core';
import {Transaction} from '../transaction';
import {ExpensesService} from '../expenses.service';
import {CategoryList} from '../category-list';
import {Category} from '../category';

@Component({
	selector: 'app-category-selector',
	templateUrl: './category-selector.component.html',
	styleUrls: ['./category-selector.component.css'],
	providers: [],
})
export class CategorySelectorComponent implements OnInit {

	@Input() selected: string;
	@Input() transaction: Transaction;

	constructor(public categories: CategoryList, public data: ExpensesService) {
	}

	ngOnInit() {
	}

	onChange(newCat) {
		console.log(this);
		this.transaction.category = newCat;
		this.data.save(this.transaction);
	}

	getOther() {
		let cats = new Map(this.categories.data);
		// console.log(this.selected, cats);
		cats.delete(this.selected);
		const array = Array.from(cats.values());
		// console.log(array);
		return array;
	}

}
