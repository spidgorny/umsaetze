///<reference path="../typings/index.d.ts"/>
"use strict";
var createDocument = require('./helper/createDocument');
createDocument['default']();
var MonthSelect_1 = require("../src/MonthSelect");
var assert = require('assert');
describe('MonthSelect', function () {
    describe('construct', function () {
        it('constructor should make an object', function () {
            var ms = new MonthSelect_1["default"]();
            expect(ms).to.be.instance.of(MonthSelect_1["default"]);
        });
    });
});
//# sourceMappingURL=MonthSelect.test.js.map