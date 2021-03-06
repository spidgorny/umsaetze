import {CategoryList} from '../services/category-list';

export class Transaction {

	id: string;
	date: Date;
	amount: number;
	category: string;
	note: string;

	categories: CategoryList;

	constructor(json: any, categories: CategoryList) {
		this.id = json.id;
		this.date = new Date(json.date);
		this.amount = parseFloat(json.amount);
		this.category = json.category || 'Default';
		this.note = json.note;

		this.categories = categories;
	}

	get sign() {
		return this.amount >= 0 ? 'positive' : 'negative';
	}

	getDate() {
		return this.date;
	}

	get cssClass() {
		return this.category == 'Default'
			? 'bg-warning' : ''
	}

	get background() {
		return this.categories.getColorFor(this.category);
	}

	save() {

	}

	isMonth(value: Date) {
		const nextMonth = new Date(value.getTime());
		nextMonth.addMonths(1);
		return this.getDate() >= value && this.getDate() < nextMonth;
	}
}
