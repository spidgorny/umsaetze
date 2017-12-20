/// <reference path="../custom_typings/json.d.ts" />

import {Injectable} from '@angular/core';
import * as JSONData from '../data/umsaetze-2017-04-20.json';
import {Transaction} from './transaction';
import 'datejs';

@Injectable()
export class JsonDataSourceService {

	file = '../data/umsaetze-2017-04-20.json';

	data: Transaction[];

	constructor() {
		this.data = [];
		(<any[]><any>JSONData).forEach(row => {
			const tr = new Transaction(row);
			// console.log(tr);
			this.data.push(tr);
		});
		console.log('jdss constructor', this.data.length);
	}

	/**
	 *
	 * @returns {number}
	 */
	get size() {
		return this.data.length;
	}

	getEarliest() {
		if (!this.size) {
			return new Date();
		}
		let min = new Date().addYears(10).valueOf();
		this.data.forEach((row: Transaction) => {
			const dDate = row.getDate();
			const date: number = dDate.valueOf();
			if (date < min) {
				min = date;
			}
		});
		return new Date(min);
	}

	getLatest() {
		if (!this.size) {
			return new Date();
		}
		let min = new Date('1970-01-01').valueOf();
		this.data.forEach((row: Transaction) => {
			const date: number = row.getDate().valueOf();
			if (date > min) {
				min = date;
			}
		});
		return new Date(min);
	}

}
