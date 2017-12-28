import {Component, Input, OnInit} from '@angular/core';
import {Transaction} from '../../models/transaction';
import {ExpensesService} from '../../services/expenses.service';
import {CategoryList} from '../../services/category-list';
import {Category} from '../../models/category';
import {CurrentMonthService} from '../../services/current-month.service';

@Component({
	selector: 'app-category-selector',
	templateUrl: './category-selector.component.html',
	styleUrls: ['./category-selector.component.css'],
	providers: [],
})
export class CategorySelectorComponent implements OnInit {

	@Input() selected: string;
	@Input() transaction: Transaction;

	constructor(protected categories: CategoryList,
				protected data: ExpensesService,
				protected currentMonth: CurrentMonthService) {
	}

	ngOnInit() {
	}

	/**
	 * Called when a new element is selected in drop-down
	 * @param option
	 * @param newCat
	 */
	onChange(option: HTMLOptionElement, newCat) {
		console.log(this);
		if (option.id === 'new') {
			const name = prompt('New Category');
			if (name) {
				newCat = name;

				// it keeps displaying '...new...', so we fix it manually
				const selector = <HTMLSelectElement>option.parentElement;
				const other = this.getOther();
				const index = other.findIndex((cat: Category) => {
					return cat.name === newCat;
				});
				selector.selectedIndex = index;
			}
		}
		if (newCat) {
			this.transaction.category = newCat;

			this.data.save(this.transaction);

			// force update of the categories in the sidebar
			this.currentMonth.emitChange(this.currentMonth.getValue());
		}
	}

	getOther() {
		const cats = new Map(this.categories.data);
		// console.log(this.selected, cats);
		cats.delete(this.selected);
		let array = Array.from(cats.values());
		// console.log(array);
		array = array.sort((c1: Category, c2: Category) => {
			return c1.name.localeCompare(c2.name);
		});
		return array;
	}

}
