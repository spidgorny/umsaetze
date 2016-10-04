///<reference path="../typings/globals/jasmine/index.d.ts"/>
"use strict";
var MonthSelect_1 = require("../../src/MonthSelect");
describe('2B||!2B', function () {
    it('true ==? false', function () {
        expect(true).toBeTruthy();
    });
});
describe('Month Select', function () {
    it('can be instantiated', function () {
        var ms = new MonthSelect_1["default"]();
        expect(ms).toBe('MonthSelect');
    });
});
//# sourceMappingURL=MonthSelect.test.js.map