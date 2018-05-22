"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CurrentMonth_1 = require("../../MonthSelect/CurrentMonth");
const log = require('ololog');
require('source-map-support').install();
describe('CurrentMonth', () => {
    it('instantiate', () => {
        new CurrentMonth_1.CurrentMonth(2018);
    });
    it('moveToFirstDayOfMonth', () => {
        const d = new Date('2018-02-15');
        d.moveToFirstDayOfMonth();
        expect(d).toEqual(new Date('2018-02-01'));
    });
    it('moveToLastDayOfMonth', () => {
        const d = new Date('2018-02-15');
        d.moveToLastDayOfMonth();
        expect(d).toEqual(new Date('2018-02-28'));
    });
    it('setHours', () => {
        const d = new Date('2018-02-15T18:19:20.500');
        d.setUTCHours(0, 0, 0, 0);
        expect(d).toEqual(new Date('2018-02-15'));
    });
    it('setEarliest', () => {
        const cm = new CurrentMonth_1.CurrentMonth(2018);
        const d = new Date('2018-02-15T18:19:20.500');
        cm.setEarliest(d);
        expect(cm.earliest).toEqual(new Date('2018-02-01'));
    });
    it('setLatest', () => {
        const cm = new CurrentMonth_1.CurrentMonth(2018);
        const d = new Date('2018-02-15T18:19:20.500');
        cm.setLatest(d);
        expect(cm.latest).toEqual(new Date('2018-02-28'));
    });
    it('update', () => {
        const cm = new CurrentMonth_1.CurrentMonth(2018);
        const earliest = new Date('2018-01-15');
        const latest = new Date('2018-12-01');
        cm.update(earliest, latest);
        expect(cm.selectedYear).toBe(2018);
        expect(cm.earliest).toEqual(new Date('2018-01-01'));
        expect(cm.latest).toEqual(new Date('2018-12-31'));
    });
});
//# sourceMappingURL=CurrentMonth.spec.js.map