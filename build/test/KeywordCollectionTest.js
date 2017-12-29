"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KeywordCollection_1 = require("../src/Keyword/KeywordCollection");
const CollectionArray_1 = require("../src/Util/CollectionArray");
class KeywordCollectionTest {
    constructor() {
        this.testCollectionFetch();
        this.testFetch();
    }
    testCollectionFetch() {
        const ca = new CollectionArray_1.default();
        console.log(ca);
        ca.fetch();
        console.log(ca);
    }
    testFetch() {
        const kc = new KeywordCollection_1.default();
        kc.fetch();
        console.log(kc);
    }
}
new KeywordCollectionTest();
//# sourceMappingURL=KeywordCollectionTest.js.map