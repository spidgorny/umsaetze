"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CategoryCollection_1 = __importDefault(require("../../Category/CategoryCollection"));
const Expenses_1 = __importDefault(require("../../Expenses/Expenses"));
const log = require('ololog');
require('source-map-support').install();
describe('CategoryCollection', () => {
    let cc;
    const ex = new Expenses_1.default([
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
        new CategoryCollection_1.default([]);
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
        cc = new CategoryCollection_1.default(fixture);
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
        expect(cc.models.length).toBe(3);
    });
    it('getOptions', () => {
        cc.setExpenses(ex);
        log(cc.getOptions());
        expect(cc.getOptions()).toEqual(['cat name', 'some cat', 'some cat 2']);
    });
    it('getColorFor', () => {
        const color = cc.getColorFor('some cat 2');
        expect(color).toContain('#');
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
//# sourceMappingURL=CategoryCollection.spec.js.map