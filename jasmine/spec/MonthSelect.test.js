///<reference path="../../typings/index.d.ts"/>
"use strict";
var MonthSelect_1 = require("../../src/MonthSelect");
var dom = require('node-dom').dom;
window = dom('', null, {});
document = window.document;
// Error: No such module: evals
describe('2B||!2B', function () {
    it('true ==? false', function () {
        expect(true).toBeTruthy();
    });
});
describe('Month Select', function () {
    it('can be instantiated', function () {
        var ms = new MonthSelect_1.default();
        expect(ms).toBe('MonthSelect');
    });
});
