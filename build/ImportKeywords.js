"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("underscore"));
const Keyword_1 = __importDefault(require("./Keyword/Keyword"));
const KeywordCollection_1 = __importDefault(require("./Keyword/KeywordCollection"));
const Excel = __importStar(require("exceljs"));
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
    }
    importFromExcel() {
        this.readExcelFile().then((categoryList) => {
            console.log('categoryList', categoryList);
        }).catch(e => {
            console.log('promise error', e);
        });
    }
    importFromClass() {
        this.kc = new KeywordCollection_1.default();
        _.each(this.keywords, (val, key) => {
            console.log(key, val);
            let kw = new Keyword_1.default({
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
                let key = cells[1];
                let category = cells[2];
                this.keywords[key] = category;
            });
            resolve(this.keywords);
        });
    }
}
exports.default = ImportKeywords;
//# sourceMappingURL=ImportKeywords.js.map