/// <reference path="../../index.d.ts" />

import CategoryCount from "../../Category/CategoryCount";
import {InvalidArgumentException} from "../../Exception/InvalidArgumentException";

describe('CategoryCount', () => {

	const cc = new CategoryCount({
		catName: 'cat name',
		color: '#abcdef',
		count: 12,
		amount: 123.55,
		id: '85764598'
	});

	it('throws without params', () => {
		expect(() => {
			new CategoryCount();
		}).toThrow(InvalidArgumentException);
	});

	it('can handle catName object', () => {
		const cc = new CategoryCount({
			catName: {
				name: 'cat name'
			},
			color: '#abcdef',
			count: 12,
			amount: 123.55,
			id: '85764598'
		});
		expect(cc.getName()).toBe('cat name');
	});

	it('setColor', () => {
		cc.setColor('#123456');
		// direct access is not supposed to work?
		//expect(cc.color).toBe('#123456');
		expect(cc.get('color')).toBe('#123456');
	});

	it('pastelColor', () => {
		expect(cc.pastelColor() > '#000000').toBe(true);
		expect(cc.pastelColor() > '#FFFFFF').toBe(true);
	});

	it('getName', () => {
		const catName = cc.getName();
		expect(catName).toBe('cat name');
	});

	it('getAmount', () => {
		const amount = cc.getAmount();
		expect(amount).toBe('123.55');
	});

	it('get(count)', () => {
		const count = cc.get('count');
		expect(count).toBe(12);
	});

	it('resetCounters', () => {
		cc.resetCounters();
		expect(cc.get('count')).toBe(0);
	});

	it('incrementCount', () => {
		cc.incrementCount();
		expect(cc.get('count')).toBe(1);
	});

	it('getAverageAmountPerMonth', () => {
		const avg = cc.getAverageAmountPerMonth({
			a: 10,
			b: 20,
			c: 30,
		});
		expect(avg).toBe('20.00');
	});

});
