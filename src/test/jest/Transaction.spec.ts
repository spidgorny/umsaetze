import Transaction from "../../Expenses/Transaction";

const log = require('ololog');

describe('Transaction', () => {

	it('getDate', () => {
		const t = new Transaction({
			id: 1236543,
			date: '2018-06-01',
			category: 'some cat',
			amount: 123.55,
			note: 'REWE',
			done: false,
		});
		expect(t.getDate()).toEqual(new Date('2018-06-01'));
	});

	it('getDate*1000', () => {
		const t = new Transaction({
			id: 1236543,
			date: '2018-06-01',
			category: 'some cat',
			amount: 123.55,
			note: 'REWE',
			done: false,
		});
		const start = new Date();
		for (let i = 0; i < 1000; i++) {
			t.getDate();
		}
		const duration = (new Date().getTime() - start.getTime()) / 1000;
		log(duration);
		expect(duration).toBeLessThan(0.001);
	});

	it('getDate*1000*1000', () => {
		const t = new Transaction({
			id: 1236543,
			date: '2018-06-01',
			category: 'some cat',
			amount: 123.55,
			note: 'REWE',
			done: false,
		});
		const start = new Date();
		for (let i = 0; i < 1000*1000; i++) {
			t.getDate();
		}
		const duration = (new Date().getTime() - start.getTime()) / 1000;
		log(duration);
		expect(duration).toBeLessThanOrEqual(0.005);
	});

});
