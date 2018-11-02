"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestFramework_1 = require("../TestFramework");
const KeywordsView_1 = require("../../Keyword/KeywordsView");
class KeywordsViewTest extends TestFramework_1.default {
    testConstructor() {
        const kv = new KeywordsView_1.KeywordsView();
    }
}
new KeywordsViewTest().run();
//# sourceMappingURL=KeywordsViewTest.js.map