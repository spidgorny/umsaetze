"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const underscore_1 = require("underscore");
const Keyword_1 = require("./Keyword");
const KeywordCollection_1 = require("./KeywordCollection");
const exceljs_1 = require("exceljs");
class ImportKeywords {
    constructor() {
        this.keywordFile = 'keywords.xlsx';
        this.keywords = {
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
        let kc = new KeywordCollection_1.default();
        underscore_1._.each(this.keywords, (val, key) => {
            console.log(key, val);
            let kw = new Keyword_1.default({
                word: key,
                category: val,
            });
            kc.add(kw);
        });
    }
    readExcelFile() {
        return new Promise((resolve, reject) => {
            var workbook = new exceljs_1.default.Workbook();
            workbook.xlsx.readFile(this.keywordFile)
                .then(() => {
                var sheet = workbook.getWorksheet(1);
                var keyWords = this.dumpSheet(sheet);
                resolve(keyWords);
            });
        });
    }
    dumpSheet(sheet) {
        return new Promise((resolve, reject) => {
            sheet.eachRow((row, rowNumber) => {
                var cells = row.values;
                var key = cells[1];
                var category = cells[2];
                this.keyWords[key] = category;
            });
            resolve(this.keyWords);
        });
    }
}
exports.default = ImportKeywords;
//# sourceMappingURL=ImportKeywords.js.map