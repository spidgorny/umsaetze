import {Component, OnInit} from '@angular/core';
import {ExpensesService} from '../../services/expenses.service';
import {Transaction} from '../../models/transaction';
import {Category} from '../../models/category';
import {Chance} from 'chance';
const chance = new Chance();
import {CategoryList} from '../../services/category-list';
import { saveAs } from 'file-saver';

@Component({
	selector: 'app-sync',
	templateUrl: './sync.component.html',
	styleUrls: ['./sync.component.css']
})
export class SyncComponent implements OnInit {

	constructor(protected expenses: ExpensesService,
				protected categories: CategoryList) {
	}

	ngOnInit() {
	}

	get memoryRows() {
		return this.expenses.size;
	}

	generate() {
		const amount = 100;
		const account = chance.word();
		for (const i of Array.from(Array(amount).keys())) {
			const category: Category = this.categories.random();
			this.expenses.data.push(new Transaction({
				account: account,
				category: category ? category.name : 'Default',
				currency: 'EUR',
				amount: chance.floating({fixed: 2, min: -1000, max: 1000}),
				payment_type: 'DEBIT_CARD',
				date: chance.date({year: new Date().getFullYear()}),
				note: chance.sentence(),
			}, this.categories));
		}
		this.expenses.saveAll();
	}

	export() {
		const data = this.expenses.data;
		// console.log(data);
		const json = JSON.stringify(data, null, '\t');
		const blob = new Blob([json], {
			type: 'application/json;charset=utf-8'
		});
		const filename = 'umsaetze-' + Date.today().toString('yyyy-MM-dd') + '.json';
		// console.log(filename);
		saveAs(blob, filename);
	}

}
