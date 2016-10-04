"use strict";
/// <reference path="../../typings/index.d.ts" />
var ParseCSV = require('../../src/Sync/ParseCSV');
describe("ParseCSV", function () {
    it("should be able to construct", function () {
        var sourceCSV = "\"Slawa\";\"Test\"\n\"Marina\";18";
        var parser = new ParseCSV(sourceCSV);
        expect(parser.data).toEqual(sourceCSV);
    });
    it('should skip all lines before and including empty', function () {
        var parser = new ParseCSV();
        var nicer = parser.analyzeCSV([
            ['asd'],
            [],
            ['qwe'],
        ]);
        expect(nicer).toBeEqual([['qwe']]);
    });
});
//# sourceMappingURL=ParseCSV.test.js.map