/// <reference path="../typings/index.d.ts" />
"use strict";
var underscore_1 = require('underscore');
var Keyword_1 = require("./Keyword");
var KeywordCollection_1 = require("./KeywordCollection");
var ImportKeywords = (function () {
    function ImportKeywords() {
        // fs is not working on the client
        // this.readExcelFile().then((categoryList) => {
        // 	console.log('categoryList', categoryList);
        // }).catch(e => {
        // 	console.log('promise error', e);
        // });
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
        var kc = new KeywordCollection_1["default"]();
        underscore_1._.each(this.keywords, function (val, key) {
            console.log(key, val);
            var kw = new Keyword_1["default"]({
                word: key,
                category: val
            });
            kc.add(kw);
        });
    }
    ImportKeywords.prototype.readExcelFile = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var Excel = require('exceljs');
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
                // not sure why this is needed
                // var cells = row.values.slice(0, 2);
                //console.log(cells.join('\t'));
                //console.log(JSON.stringify(cells));
                var key = cells[1];
                var category = cells[2];
                //console.log(key, category);
                _this.keyWords[key] = category;
            });
            //console.log(this.keyWords);
            resolve(_this.keyWords);
        });
    };
    return ImportKeywords;
}());
exports.__esModule = true;
exports["default"] = ImportKeywords;
//# sourceMappingURL=ImportKeywords.js.map