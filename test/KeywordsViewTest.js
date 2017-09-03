"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var TestFramework_1 = require("./TestFramework");
var KeywordsView_1 = require("../src/Keyword/KeywordsView");
var KeywordsViewTest = /** @class */ (function (_super) {
    __extends(KeywordsViewTest, _super);
    function KeywordsViewTest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeywordsViewTest.prototype.testConstructor = function () {
        var kv = new KeywordsView_1["default"]();
    };
    return KeywordsViewTest;
}(TestFramework_1["default"]));
new KeywordsViewTest().run();
//# sourceMappingURL=KeywordsViewTest.js.map