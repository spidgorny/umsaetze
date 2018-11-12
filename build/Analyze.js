"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const natural_1 = __importDefault(require("natural"));
class Analyze {
    constructor(ex) {
        this.frequency = {};
        this.blackList = [
            'EUR', 'SEPA', 'SVWZ', 'DANKE', 'MREF', 'CRED', 'PAN', 'EREF',
            'EC', 'GIROCARD', 'SAGT', 'BASISLASTSCHRIFT', 'CGDD', 'ABWE', 'OFFLIN',
            'BERWEISUNG', 'GmbH', 'Frankfurt', 'kartenbasierter', 'IBAN',
            'Lastschrift', 'GMBH', 'KREF', 'gute', 'FRANKFURT', 'CICC', 'FPIN',
            'EUROPE', 'qWSbxyw', 'nicht', 'RWXM8zT', 'ELV5560', 'FRANKFU',
            'Dh6cMramV4U', 'CardProcess', 'Europe', 'DE94ZZ', 'Z00000561653',
            'FRANKF', 'Deutschland', 'OTHR', 'Zahlung', 'DEUTSCHLAND',
            'DE61ZZZ00000018368', 'DE50ZZZ00000379697', 'PAYMENTS', 'kartenb',
            'BASISLAS', 'TSCHRIFT', 'sonstige', 'DE94ZZZ00000561'
        ];
        this.wordCategory = {};
        this.data = ex;
    }
    render() {
        const n = new natural_1.default.WordTokenizer();
        for (let tr of this.data.getVisible()) {
            const note = tr.get('note');
            const words = n.tokenize(note);
            for (let word of words) {
                this.increment(word, tr.get('category'));
            }
        }
        const keysSorted = Object.keys(this.frequency).sort((a, b) => {
            return this.frequency[b] - this.frequency[a];
        });
        const top100 = keysSorted.slice(0, 100);
        for (let key of top100) {
            console.log(key, this.frequency[key], this.wordCategory[key]);
        }
    }
    increment(word, category) {
        const isNum = /^\d+$/.test(word);
        if (isNum) {
            return;
        }
        if (word.length < 4) {
            return;
        }
        if (this.blackList.includes(word)) {
            return;
        }
        if (word in this.frequency) {
            this.frequency[word]++;
        }
        else {
            this.frequency[word] = 1;
        }
        if (!(word in this.wordCategory)) {
            this.wordCategory[word] = [];
        }
        if (category === undefined) {
            return;
        }
        if (!(this.wordCategory[word].includes(category))) {
            this.wordCategory[word].push(category);
        }
    }
}
exports.Analyze = Analyze;
//# sourceMappingURL=Analyze.js.map