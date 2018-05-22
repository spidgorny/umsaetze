import Expenses from "../../Expenses/Expenses";

const log = require('ololog');

describe('Expenses', () => {

	let ex: Expenses;

	it('initialize', () => {
		ex = new Expenses([
			{
				id: 1236543,
				date: '2018-06-01',
				category: 'some cat',
				amount: 123.55,
				note: 'REWE',
				done: false,
			},
			{
				id: 1236544,
				date: '2018-06-01',
				category: 'some cat',
				amount: 123.55,
				note: 'REWE',
				done: false,
			},
			{
				id: 1236545,
				date: '2018-06-01',
				category: 'some cat 2',
				amount: 123.55,
				note: 'REWE',
				done: false,
			}
		]);
		//log(ex.models);
		expect(ex.models.length).toBe(3);
	});

	it('getVisible', () => {
		ex.setAllVisible();
		log(ex.toJSON());
		expect(ex.getVisible().length).toBe(3);
		expect(ex.getVisibleCount()).toBe(3);
	})

});
