"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CategoryCount_1 = require("../../Category/CategoryCount");
const InvalidArgumentException_1 = require("../../Exception/InvalidArgumentException");
describe('CategoryCount', () => {
    const cc = new CategoryCount_1.default({
        catName: 'cat name',
        color: '#abcdef',
        count: 12,
        amount: 123.55,
        id: '85764598'
    });
    it('throws without params', () => {
        expect(() => {
            new CategoryCount_1.default();
        }).toThrow(InvalidArgumentException_1.InvalidArgumentException);
    });
    it('setColor', () => {
        cc.setColor('#123456');
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
//# sourceMappingURL=CategoryCount.spec.js.map