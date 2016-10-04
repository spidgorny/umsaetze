/// <reference path="../../typings/index.d.ts" />
import ParseCSV = require('../../src/Sync/ParseCSV');

describe("ParseCSV", function() {

	it("should be able to construct", function () {
		let sourceCSV = `"Slawa";"Test"
"Marina";18`;
		let parser = new ParseCSV(sourceCSV);
		expect(parser.data).toEqual(sourceCSV);
	});

	it('should skip all lines before and including empty', () => {
		let parser = new ParseCSV();
		let nicer = parser.analyzeCSV([
			['asd'],
			[],
			['qwe'],
		]);
		expect(nicer).toBeEqual([['qwe']]);
	});

});

