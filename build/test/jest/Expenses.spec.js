"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expenses_1 = require("../../Expenses/Expenses");
const log = require('ololog');
describe('Expenses', () => {
    let ex;
    it('initialize', () => {
        ex = new Expenses_1.default([
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
        expect(ex.models.length).toBe(3);
    });
    it('getVisible', () => {
        ex.setAllVisible();
        log(ex.toJSON());
        expect(ex.getVisible().length).toBe(3);
        expect(ex.getVisibleCount()).toBe(3);
    });
});
//# sourceMappingURL=Expenses.spec.js.map