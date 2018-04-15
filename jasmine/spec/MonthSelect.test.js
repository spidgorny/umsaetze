"use strict";
// /<reference path="../../typings/index.d.ts"/>
exports.__esModule = true;
// const dom = require('node-dom').dom;
// window = dom('', null, {});
// document = window.document;
// Error: No such module: evals
// import Window from '../../src/test/DOM/Window';
// global['window'] = new Window();
// global['document'] = global['window'].document;
// ReferenceError: document is not defined
var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
var window = new JSDOM().window;
var document = window.document;
global['window'] = window;
global['document'] = document;
var MonthSelect_1 = require("../../src/MonthSelect/MonthSelect");
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
