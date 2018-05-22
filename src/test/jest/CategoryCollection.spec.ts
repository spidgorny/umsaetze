import CategoryCollection from "../../Category/CategoryCollection";
import Expenses from "../../Expenses/Expenses";

const log = require('ololog');
require('source-map-support').install();

describe('CategoryCollection', () => {

	let cc: CategoryCollection;

	const ex = new Expenses([
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
	ex.setAllVisible();

	it('instantiate', () => {
		new CategoryCollection([]);
	});

	it('instantiate with data', () => {
		let fixture = [
			{
				catName: 'cat name',
				color: '#abcdef',
				count: 12,
				amount: 123.55,
				id: '85764598'
			}
		];
		// log('fixture.length', fixture.length);
		cc = new CategoryCollection(fixture);
		// log('cc.models', cc.models.length);
	});

	it('length', () => {
		expect(cc.length).toBe(1);
	});

	it('setExpenses', () => {
		expect(ex.models.length).toBe(3);
		cc.setExpenses(ex);
	});

	it('resetCounters', () => {
		cc.resetCounters();
		expect(cc.models[0].getAmountFloat()).toBe(0);
		expect(cc.models[0].get('count')).toBe(0);
	});

	it('getCategoriesFromExpenses', () => {
		cc.setExpenses(ex);
		cc.getCategoriesFromExpenses();
		// log(cc.toJSON());
		expect(cc.models.length).toBe(3);
	});

	it('getOptions', () => {
		cc.setExpenses(ex);
		log(cc.getOptions());
		expect(cc.getOptions()).toEqual(['cat name', 'some cat', 'some cat 2']);
	});

	it('getColorFor', () => {
		const color = cc.getColorFor('some cat 2');
		expect(color).toContain('#')
	});

	it('exists', () => {
		expect(cc.exists('cat name')).toBe(true);
		expect(cc.exists('dog name')).toBe(false);
	});

	it('addCategory', () => {
		expect(cc.models.length).toBe(3);
		cc.addCategory('dog name');
		expect(cc.models.length).toBe(4);
	});

});
