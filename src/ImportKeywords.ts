import * as _ from 'underscore';
import Keyword from "./Keyword/Keyword";
import KeywordCollection from "./Keyword/KeywordCollection";
import * as Excel from 'exceljs';

export default class ImportKeywords {

	keywordFile = 'keywords.xlsx';

	public keywords = {
		"1u1": "Internet",
		"ALDI": "Lebensmittel",
		"Aldi Talk": "Handy",
		"AMAZON": "Einkauf",
		"ARAL": "Auto",
		"AUTOHAUS NIX": "Auto",
		"BUERGERAMT": "BUERGERAMT",
		"C+A": "Kleidung",
		"CINESTAR": "Hobby/Entertainment",
		"DECATHLON": "Hobby/Entertainment",
		"DEICHMANN": "Kleidung",
		"DEUTSCHE POST": "Post",
		"DM": "Drogerie",
		"EBAY": "Einkauf",
		"Familienkasse": "Income",
		"GAA": "Cash",
		"IKEA": "Moebel",
		"ING-DiBa": "Darlehen",
		"INTERTOYS": "Kinder",
		"Kartenumsatz": "Kreditkarte",
		"MADE BY YOU": "Hobby/Entertainment",
		"Mainova": "Nebenkosten",
		"MCDONALDS": "Restaurant",
		"Musikschule": "Kinder",
		"NANU-NANA": "Einkauf",
		"NETTO": "Lebensmittel",
		"NINTENDO": "Income",
		"OLES PIDGORNYY": "Kinder",
		"Ordnungsamt": "Auto",
		"PayPal": "Einkauf",
		"Penny": "Lebensmittel",
		"REAL": "Lebensmittel",
		"REWE": "Lebensmittel",
		"ROSSMANN": "Drogerie",
		"Samariter": "Kinder",
		"Schwimmclub": "Hobby/Entertainment",
		"Shell": "Auto",
		"SIMON + STOLLE": "Internet",
		"Sparen": "Sparen",
		"SPORTARENA": "Hobby/Entertainment",
		"STADLER": "Transport",
		"Stadtentwaesserung": "Nebenkosten",
		"TARGOBANK": "Cash",
		"Tchibo": "Einkauf",
		"Techniker Krankenkasse": "Krankengeld",
		"tegut": "Lebensmittel",
		"Telekom": "Telefon",
		"Tickets": "Hobby/Entertainment",
		"TOTAL": "Auto",
		"UNIVERSITAET": "Education",
		"VGF": "Transport",
		"Volkshochschule": "Education",
		"WOOLWORTH": "Einkauf",
		"ZEEMAN": "Kleidung"
	};

	public kc: KeywordCollection;

	constructor() {
	}

	importFromExcel() {
		// fs is not working on the client
		this.readExcelFile().then((categoryList) => {
			console.log('categoryList', categoryList);
		}).catch(e => {
			console.log('promise error', e);
		});
	}

	importFromClass() {
		this.kc = new KeywordCollection();
		_.each(this.keywords, (val, key) => {
			console.log(key, val);
			let kw = new Keyword({
				word: key,
				category: val,
			});
			this.kc.add(kw);
		});
	}

	readExcelFile() {
		return new Promise((resolve, reject) => {
			const workbook = new Excel.Workbook();
			workbook.xlsx.readFile(this.keywordFile)
				.then(() => {
					const sheet = workbook.getWorksheet(1);
					const keyWords = this.dumpSheet(sheet);
					resolve(keyWords);
				});
		});
	}

	dumpSheet(sheet) {
		return new Promise((resolve, reject) => {
			sheet.eachRow((row, rowNumber) => {
				let cells = row.values;
				// not sure why this is needed
				// var cells = row.values.slice(0, 2);

				//console.log(cells.join('\t'));
				//console.log(JSON.stringify(cells));
				let key = cells[1];
				let category = cells[2];
				//console.log(key, category);
				this.keywords[key] = category;
			});
			//console.log(this.keyWords);
			resolve(this.keywords);
		});
	}

}
