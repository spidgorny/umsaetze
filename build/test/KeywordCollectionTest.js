"use strict";
exports.__esModule = true;
var KeywordCollection_1 = require("../src/Keyword/KeywordCollection");
var CollectionArray_1 = require("../src/Keyword/CollectionArray");
var KeywordCollectionTest = /** @class */ (function () {
    function KeywordCollectionTest() {
        this.testCollectionFetch();
        this.testFetch();
    }
    KeywordCollectionTest.prototype.testCollectionFetch = function () {
        var ca = new CollectionArray_1["default"]();
        console.log(ca);
        ca.fetch();
        console.log(ca);
    };
    KeywordCollectionTest.prototype.testFetch = function () {
        var kc = new KeywordCollection_1["default"]();
        kc.fetch();
        console.log(kc);
    };
    return KeywordCollectionTest;
}());
new KeywordCollectionTest();
//# sourceMappingURL=KeywordCollectionTest.js.map