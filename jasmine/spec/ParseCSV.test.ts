/// <reference path="../../typings/index.d.ts" />
import ParseCSV from "../../src/Sync/ParseCSV";
import Table from "../../src/Sync/Table";

describe("ParseCSV", function() {

	it("should be able to construct", function () {
		let sourceCSV = `"Slawa";"Test"
"Marina";18`;
		let parser = new ParseCSV(sourceCSV);
		expect(parser.data).toEqual(sourceCSV);
	});

	it('should skip all lines before and including empty', () => {
		let parser = new ParseCSV();
		let nicer = parser.analyzeCSV(new Table([
			['asd'],
			[],
			['qwe'],
		]));
		expect(nicer.toVanillaTable()).toEqual([['qwe']]);
	});

});

