import {Component, Input, OnInit} from '@angular/core';
import {Transaction} from '../transaction';
import {ExpensesService} from '../expenses.service';

@Component({
	selector: 'app-category-selector',
	templateUrl: './category-selector.component.html',
	styleUrls: ['./category-selector.component.css'],
	providers: [ExpensesService],
})
export class CategorySelectorComponent implements OnInit {

	@Input() selected: string;
	@Input() transaction: Transaction;

	constructor(public data: ExpensesService) {
	}

	ngOnInit() {
	}

	onChange(newCat) {
		console.log(this);
		this.transaction.category = newCat;
		this.data.save(this.transaction);
	}

}
