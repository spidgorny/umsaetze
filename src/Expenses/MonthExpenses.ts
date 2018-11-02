import Transaction from "./Transaction";
import Expenses from "./Expenses";
import {CurrentMonth} from "../MonthSelect/CurrentMonth";
import CategoryCount from "../Category/CategoryCount";
import Keyword from "../Keyword/Keyword";
import KeywordCollection from "../Keyword/KeywordCollection";
import {Dictionary} from "../../node_modules/@types/underscore";

const log = require('ololog');

/**
 * Represents only some expenses of the specific month
 */
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

	/**
	 * @deprecated types mismatch
	 * @param callback
	 * @param init
	 */
	reduce(callback: Function, init = null) {
		// return _.reduce(this.expenses.models, callback, init);
		// return this.expenses.models.reduce(callback, init);
	}

	getTotal() {
		let total = 0;
		// for (const transaction of this.expenses.models) {
		// this is the only valid way to iterate
		this.expenses.each(transaction => {
			const amount = transaction.getAmount();
			total += amount;
		});
		return total;
	}

	getPositiveTotal() {
		let total = 0;
		// for (const transaction of this.expenses.models) {
		// this is the only valid way to iterate
		this.expenses.each(transaction => {
			const amount = transaction.getAmount();
			if (amount > 0) {
				total += amount;
			}
		});
		return total;
	}

	getNegativeTotal() {
		let total = 0;
		// for (const transaction of this.expenses.models) {
		// this is the only valid way to iterate
		this.expenses.each(transaction => {
			// console.log(transaction);
			const amount = transaction.getAmount();
			if (amount < 0) {
				total += amount;
			}
		});
		return total;
	}
}
