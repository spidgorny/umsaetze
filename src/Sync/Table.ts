import Row from "./Row";
import ArrayPlus from "./ArrayPlus";

const _ = require('underscore');


export default class Table extends ArrayPlus {

	constructor(rows?: Array<any>) {
		super();
		if (rows) {
			//console.log('ArrayPlus', rows.length);
			rows.forEach((el, i) => {
				this[i] = new Row(el);
			});
		}
	}

	static fromText(text: string) {
		let self = new Table();
		let lines = self.tryBestSeparator(text);
		lines.forEach((row, i) => {
			self.push(row);
		});
		return self;
	}

	tryBestSeparator(text: string) {
		let linesC = Table.CSVToArray(text, ',');
		let linesS = Table.CSVToArray(text, ';');

		let colsC = [];
		let colsS = [];
		for (let i = 0; i < 100 && i < linesC.length && i < linesS.length; i++) {
			colsC.push(linesC[i].length);
			colsS.push(linesS[i].length);
		}
		// console.log(colsC, colsS);
		let sumC = colsC.reduce(function (a, b) { return a + b; });
		let sumS = colsS.reduce(function (a, b) { return a + b; });
		console.log(', => ', sumC, '; => ', sumS);
		let lines;
		if (sumC > sumS) {
			lines = linesC;
		} else {
			lines = linesS;
		}
		return lines;
	}

	/**
	 * http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
	 * @param strData
	 * @param strDelimiter
	 * @returns {Array[]}
	 * @constructor
	 */
	static CSVToArray( strData, strDelimiter ) {
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		strDelimiter = (strDelimiter || ",");

		// Create a regular expression to parse the CSV values.
		let objPattern = new RegExp(
			(
				// Delimiters.
				"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

				// Quoted fields.
				"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

				// Standard fields.
				"([^\"\\" + strDelimiter + "\\r\\n]*))"
			),
			"gi"
		);


		// Create an array to hold our data. Give the array
		// a default empty first row.
		let arrData = [[]];

		// Create an array to hold our individual pattern
		// matching groups.
		let arrMatches = null;


		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (arrMatches = objPattern.exec( strData )){

			// Get the delimiter that was found.
			let strMatchedDelimiter = arrMatches[ 1 ];

			// Check to see if the given delimiter has a length
			// (is not the start of string) and if it matches
			// field delimiter. If id does not, then we know
			// that this delimiter is a row delimiter.
			if (
				strMatchedDelimiter.length &&
				strMatchedDelimiter !== strDelimiter
			){

				// Since we have reached a new row of data,
				// add an empty row to our data array.
				arrData.push( [] );

			}

			let strMatchedValue;

			// Now that we have our delimiter out of the way,
			// let's check to see which kind of value we
			// captured (quoted or unquoted).
			if (arrMatches[ 2 ]){

				// We found a quoted value. When we capture
				// this value, unescape any double quotes.
				strMatchedValue = arrMatches[ 2 ].replace(
					new RegExp( "\"\"", "g" ),
					"\""
				);

			} else {

				// We found a non-quoted value.
				strMatchedValue = arrMatches[ 3 ];

			}


			// Now that we have our value string, let's add
			// it to the data array.
			arrData[ arrData.length - 1 ].push( strMatchedValue );
		}

		// Return the parsed data.
		return( arrData );
	}

	getRowTypesForSomeRows() {
		let typeSet = new Table();
		console.log('getRowTypesForSomeRows', this.length);
		let iter = 0;
		this.forEach((row0, i) => {
			let row: Row = new Row(row0);
			let types = row.getRowTypes();
			//console.log(i, row, types);
			typeSet.push(types);
			iter++;
			if (iter > 100) {
				return false;
			}
		});
		return typeSet;
	}

	filterMostlyNull() {
		let notNull = this.filter((row) => {
			let countNull = row.filter(type => {
				return type == 'null';
			}).length;
			// console.log(countNull, row);
			return countNull < row.length / 2;
		});
		return new Table(notNull);
	}

}
