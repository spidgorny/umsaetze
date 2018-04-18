"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('./bootstrap');
const log = console.log;
log.error = console.error;
const MonthSelect_1 = require("../../MonthSelect/MonthSelect");
describe('2B||!2B', () => {
    it('true ==? false', () => {
        expect(true).toBeTruthy();
    });
});
describe('Month Select', () => {
    it('can be instantiated', () => {
        const storage = require('local-storage-mock');
        let ms = new MonthSelect_1.default(storage);
        expect(ms.constructor.name).toBe('MonthSelect');
    });
});
//# sourceMappingURL=CategoryView.test.js.map