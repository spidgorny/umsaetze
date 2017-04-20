"use strict";
/// <reference path="../../typings/index.d.ts" />
var ParseCSV_1 = require("../../src/Sync/ParseCSV");
var Table_1 = require("../../src/Sync/Table");
describe("ParseCSV", function () {
    it("should be able to construct", function () {
        var sourceCSV = "\"Slawa\";\"Test\"\n\"Marina\";18";
        var parser = new ParseCSV_1.default(sourceCSV);
        expect(parser.data).toEqual(sourceCSV);
    });
    it('should skip all lines before and including empty', function () {
        var parser = new ParseCSV_1.default();
        var nicer = parser.analyzeCSV(new Table_1.default([
            ['asd'],
            [],
            ['qwe'],
        ]));
        expect(nicer.toVanillaTable()).toEqual([['qwe']]);
    });
});
