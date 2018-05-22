import Transaction from "./Transaction";
import Expenses from "./Expenses";
import {CurrentMonth} from "../MonthSelect/CurrentMonth";
import CategoryCount from "../Category/CategoryCount";
import Keyword from "../Keyword/Keyword";
import KeywordCollection from "../Keyword/KeywordCollection";

const log = require('ololog');

export class MonthExpenses {

	model: typeof Transaction;

	expenses: Expenses;

	month: CurrentMonth;

	category: CategoryCount = null;

	constructor(expenses: Expenses, month: CurrentMonth) {
		this.expenses = expenses;
		this.month = month;
	}

	setCategory(cat: CategoryCount) {
		this.category = cat;
	}

	getSorted() {
		this.expenses.setAllVisible();							// silent
		this.expenses.filterByMonth(this.month.getSelected());	// silent
		if (this.category) {
			this.expenses.filterByCategory(this.category);
		}

		return this.expenses.getSorted();
	}

	size() {
		return this.getSorted().length;
	}

	getDateFrom() {
		this.getSorted();
		return this.expenses.getDateFrom();
	}

	getDateTill() {
		this.getSorted();
		return this.expenses.getDateTill();
	}

	saveAll() {
		this.expenses.saveAll();
	}

	getVisibleCount() {
		return this.size();
	}

	get(id) {
		return this.expenses.get(id);
	}

	remove(id, options?) {
		return this.expenses.remove(id, options);
	}

	/**
	 * Called by [Apply Keywords] button
	 * @param {KeywordCollection} keywords
	 */
	setCategories(keywords: KeywordCollection) {
		console.group('Expenses.setCategories');
		console.log('setCategories', this.size(), keywords.size());
		let anythingChanged = false;
		this.each((row: Transaction) => {
			if (row.get('category') === CategoryCount.DEFAULT) {
				let note = row.get('note');
				// console.log(note.length, keywords.size());
				keywords.each((key: Keyword) => {
					let found = note.indexOf(key.word);
					if (key.word == 'SVYETOSLAV PIDGORNYY') {
						log(note.length, key.word, found);
					}
					if (found > -1) {
						//console.log(note, 'contains', key.word, 'gets', key.category);
						row.set('category', key.category, { silent: true });
						anythingChanged = true;
					}
				});
			}
		});
		if (anythingChanged) {
			console.log('trigger change', this.expenses._events);
			this.trigger('change');
		} else {
			console.log('nothing changed');
		}
		console.groupEnd();
	}

	each(cb) {
		for (let el of this.getSorted()) {
			cb(el);
		}
	}

	trigger(event) {
		this.expenses.trigger(event);
	}

}
