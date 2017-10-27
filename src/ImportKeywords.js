import { _ } from 'underscore';
import Keyword from "./Keyword";
import KeywordCollection from "./KeywordCollection";
import Excel from 'exceljs';
var ImportKeywords = (function () {
    function ImportKeywords() {
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
        var kc = new KeywordCollection();
        _.each(this.keywords, function (val, key) {
            console.log(key, val);
            var kw = new Keyword({
                word: key,
                category: val,
            });
            kc.add(kw);
        });
    }
    ImportKeywords.prototype.readExcelFile = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var workbook = new Excel.Workbook();
            workbook.xlsx.readFile(_this.keywordFile)
                .then(function () {
                var sheet = workbook.getWorksheet(1);
                var keyWords = _this.dumpSheet(sheet);
                resolve(keyWords);
            });
        });
    };
    ImportKeywords.prototype.dumpSheet = function (sheet) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            sheet.eachRow(function (row, rowNumber) {
                var cells = row.values;
                var key = cells[1];
                var category = cells[2];
                _this.keyWords[key] = category;
            });
            resolve(_this.keyWords);
        });
    };
    return ImportKeywords;
}());
export default ImportKeywords;
//# sourceMappingURL=ImportKeywords.js.map