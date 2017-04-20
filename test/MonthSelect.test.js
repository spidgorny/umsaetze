///<reference path="../typings/index.d.ts"/>
"use strict";
var createDocument = require('./helper/createDocument');
createDocument['default']();
var MonthSelect_1 = require("../src/MonthSelect");
var MonthSelectMock_1 = require("./helper/MonthSelectMock");
var ExpensesMock_1 = require("./helper/ExpensesMock");
var assert = require('assert');
//import expect, { createSpy, spyOn, isSpy } from 'expect';
var expect = require('expect');
require('../src/Util/Number'); // for clamp
expect.extend({
    toBeAColor: function () {
        expect.assert(this.actual.match(/^#[a-fA-F0-9]{3,6}$/), 'expected %s to be an HTML color', this.actual);
        return this;
    },
    toBeSameTime: function (time) {
        expect.assert(this.actual.getTime() == time.getTime(), 'expected %s to be the same time\n' +
            this.actual.getTime() + ' != ' + time.getTime() + '\n' +
            this.actual.toString('yyyy-MM-dd HH:mm:ss') + ' != ' + time.toString('yyyy-MM-dd HH:mm:ss'), this.actual);
        return this;
    }
});
var MonthSelectTest = (function () {
    /**
     * constructor should make an object
     */
    function MonthSelectTest() {
    }
    MonthSelectTest.prototype.getMethods = function () {
        // console.log(this);
        // console.log(this.prototype);
        // console.log(MonthSelectTest);
        // console.log(MonthSelectTest.prototype);
        // console.log(Object.getOwnPropertyNames(this));
        // console.log(Object.getOwnPropertyNames(MonthSelectTest.prototype));
        var methods = {};
        for (var name_1 in (MonthSelectTest.prototype)) {
            var value = MonthSelectTest.prototype[name_1];
            // console.log(name, typeof value);
            if (typeof value == "function" && name_1 !== 'getMethods') {
                methods[name_1] = value;
            }
        }
        return methods;
    };
    MonthSelectTest.prototype.setUp = function (callback) {
        //console.log('setUp');
        callback();
    };
    MonthSelectTest.prototype.test_clamp = function (test) {
        expect((10).clamp(15, 20)).toBe(15);
        test.done();
    };
    MonthSelectTest.prototype.test_construct = function (test) {
        var ms = new MonthSelectMock_1.default();
        expect(ms).toBeA(MonthSelect_1.default);
        test.done();
    };
    MonthSelectTest.prototype.test_loadData = function (test) {
        var ex = new ExpensesMock_1.default();
        ex.load('test/data/umsaetze-2017-04-20.json');
        expect(ex.size()).toBe(235);
        test.done();
    };
    MonthSelectTest.prototype.test_getEarliest = function (test) {
        var ex = new ExpensesMock_1.default();
        ex.load('test/data/umsaetze-2017-04-20.json');
        expect(ex.getEarliest()).toBeSameTime(new Date('Fri Jan 20 2017 00:00:00 GMT+0100'));
        test.done();
    };
    MonthSelectTest.prototype.test_getLatest = function (test) {
        var ex = new ExpensesMock_1.default();
        ex.load('test/data/umsaetze-2017-04-20.json');
        expect(ex.getLatest()).toBeSameTime(new Date('Thu Apr 20 2017 00:00:00 GMT+0200'));
        test.done();
    };
    MonthSelectTest.prototype.test_loadDataAndUpdateMonthSelect = function (test) {
        var ex = new ExpensesMock_1.default();
        ex.load('test/data/umsaetze-2017-04-20.json');
        var ms = new MonthSelectMock_1.default();
        ms.update(ex);
        expect(ms.earliest).toBeSameTime(ex.getEarliest().moveToFirstDayOfMonth());
        expect(ms.latest).toBeSameTime(ex.getLatest());
        test.done();
    };
    MonthSelectTest.prototype.test_loadDataAndUpdateMonthSelectCurrentMonth = function (test) {
        var ex = new ExpensesMock_1.default();
        ex.load('test/data/umsaetze-2017-04-20.json');
        var ms = new MonthSelectMock_1.default();
        ms.update(ex);
        expect(ms.selectedYear).toBe(2017);
        expect(ms.selectedMonth).toBe('Feb');
        test.done();
    };
    MonthSelectTest.prototype.test_whereMonth = function (test) {
        var ex = new ExpensesMock_1.default();
        ex.load('test/data/umsaetze-2017-04-20.json');
        var ms = new MonthSelectMock_1.default();
        ms.update(ex);
        ex.setAllVisible();
        expect(ex.size()).toBe(235);
        var yearMonth = ms.getSelected();
        expect(yearMonth).toBeSameTime(new Date('2017-02-01 00:00:00 GMT+1'));
        var wm = ex.whereMonth(yearMonth);
        expect(wm.length).toBe(85);
        test.done();
    };
    MonthSelectTest.prototype.test_stepBackTillSalary = function (test) {
        var ex = new ExpensesMock_1.default();
        ex.load('test/data/umsaetze-2017-04-20.json');
        var ms = new MonthSelectMock_1.default();
        ms.update(ex);
        expect(ex.size()).toBe(235);
        ex.setAllVisible();
        ex.dumpVisible();
        //let allVisible = ex.getVisible();
        //console.log(allVisible);
        expect(ex.getVisible().length).toBe(235);
        expect(ex.getVisibleCount()).toBe(235);
        var yearMonth = ms.getSelected();
        expect(yearMonth).toBeSameTime(new Date('2017-02-01 00:00:00 GMT+1'));
        ex.filterByMonth(yearMonth);
        expect(ex.getVisible().length).toBe(85);
        ex.stepBackTillSalary(ms);
        expect(ex.getVisible().length).toBe(97);
        test.done();
    };
    return MonthSelectTest;
}());
module.exports = new MonthSelectTest().getMethods();
// console.log(module.exports);
