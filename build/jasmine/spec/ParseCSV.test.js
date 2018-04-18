"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParseCSV_1 = require("../../Sync/ParseCSV");
const Table_1 = require("../../Sync/Table");
describe("ParseCSV", function () {
    it("should be able to construct", function () {
        let sourceCSV = `"Slawa";"Test"
"Marina";18`;
        let parser = new ParseCSV_1.default(sourceCSV);
        expect(parser.data).toEqual(sourceCSV);
    });
    it('should skip all lines before and including empty', () => {
        let parser = new ParseCSV_1.default();
        let nicer = parser.analyzeCSV(new Table_1.default([
            ['asd'],
            [],
            ['qwe'],
        ]));
        expect(nicer.toVanillaTable()).toEqual([['qwe']]);
    });
});
//# sourceMappingURL=ParseCSV.test.js.map