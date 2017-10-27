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
import CollectionArray from './CollectionArray';
import Keyword from './Keyword';
var KeywordCollection = (function (_super) {
    __extends(KeywordCollection, _super);
    function KeywordCollection() {
        var arguments2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arguments2[_i] = arguments[_i];
        }
        var _this = _super.apply(this, arguments2) || this;
        _this.modelClass = Keyword;
        _this.fetch();
        return _this;
    }
    return KeywordCollection;
}(CollectionArray));
export default KeywordCollection;
//# sourceMappingURL=KeywordCollection.js.map