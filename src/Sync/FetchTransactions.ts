/// <reference path="../../node_modules/@types/node/index.d.ts" />

import Expenses from "../Expenses/Expenses";
import Backbone = require('backbone');
import * as _ from 'underscore';
import axios from 'axios';
import {TransactionFactory} from "../Expenses/TransactionFactory";

const log = require('ololog');

export class FetchTransactions {

	div: JQuery;

	email: string = 'e.m@i.l';

	password: string = '';

	blz: string = '123';

	konto: string = '123';

	pin: string = '123';

	template = `
<div class="panel panel-default">
	<div class="panel-heading">
		Fetch last transactions directly from your bank.
	</div>
	<div class="panel-body">
		<form id="FetchTransactionsForm">
			<div class="form-group">
				<label for="email">E-mail address</label>
				<input type="email" name="email" value="<%- email %>" required class="form-control"/>
			</div>
			<div class="form-group">
    			<label for="password">FinApi Password (leave blank to register)</label>
    			<input type="password" name="password" class="form-control"/>
			</div>
			<div class="form-group">
    			<label for="blz">Your bank BLZ</label>
    			<input type="text" name="blz" value="<%- blz %>" required class="form-control"/>
			</div>
			<div class="form-group">
    			<label for="konto">Your bank account number</label>
    			<input type="text" name="konto" value="<%- konto %>" required class="form-control"/>
			</div>
			<div class="form-group">
    			<label for="pin">Your online banking PIN code <span title="See FinApi.io for privacy policy">(i)</span></label>
    			<input type="password" name="pin" required class="form-control" value="<%- pin %>"/>
    			<!--<p class="help-block">PIN is only required during the registration.</p>-->
			</div>
			<input type="submit" value="Fetch Transactions" class="btn btn-default"/>
		</form>
	</div>
</div>
`;

	templateFunc: Function;

	form: JQuery;

	expenses: Expenses;

	tf: TransactionFactory;

	constructor(expenses: Expenses, tf: TransactionFactory) {
		// this.templateFunc = new Function("return `" + this.template.replace('$_', '$') +"`;").bind(this);
		this.templateFunc = _.template(this.template);
		this.expenses = expenses;
		this.tf = tf;

		const defaultFields = window.localStorage.getItem('FetchTransactions');
		log(defaultFields);
		const values = JSON.parse(defaultFields);
		Object.assign(this, values);	// unsafe?
	}

	setDiv(div: JQuery) {
		this.div = div;
	}

	render() {
		log('FetchTransactions', this.div);
		this.email = 'something@else.com';
		this.div.html(this.templateFunc(this));
		this.form = this.div.find('#FetchTransactionsForm');
		this.form.on('submit', this.startFetch.bind(this));
	}

	async startFetch(event: Event) {
		event.preventDefault();
		const json = this.getFormValues(this.form);

		// unsafe to store values?
		//window.localStorage.setItem('FetchTransactions', JSON.stringify(json));

		try {
			// const url = 'http://localhost:3000/fetchTransactions';
			const url = 'http://localhost:3000/test';
			const response = await axios.get(url, {
				params: json,
			});
			console.log(response.data.data);
			for (let t of response.data.data) {
				this.expenses.add(this.tf.make({
					account: null,
					category: (t.category && 'name' in t.category) ? t.category.name : 'Default',
					currency: "EUR",
					amount: t.amount,
					payment_type: t.type,
					date: t.bankBookingDate,
					note: t.counterpartName,
					...t,
				}));
			}

			Backbone.history.navigate('#', {
				trigger: true,
			});
		} catch (e) {
			console.error(e);
		}
		return false;
	}

	/**
	 * @deprecated
	 */
	getFormValuesPure() {
		const form: HTMLFormElement = <HTMLFormElement> this.form.get(0);
		const json = {};
		const data = new FormData(form);
		// new FormData(form).forEach((value, k) => {
		// 	json[k] = value;
		// });
		// for (const [key, value] of new FormData(form).entries()) {
		// 	json[key] = value;
		// }
		// for (const key in data.keys()) {
		// 	json[key] = data.get(key);
		// }
	}

	getFormValues(form) {
		const config = {};
		this.form.serializeArray().map(function(item) {
			if ( config[item.name] ) {
				if ( typeof(config[item.name]) === "string" ) {
					config[item.name] = [config[item.name]];
				}
				config[item.name].push(item.value);
			} else {
				config[item.name] = item.value;
			}
		});
		return config;
	}

}
