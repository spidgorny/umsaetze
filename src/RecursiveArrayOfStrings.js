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
var RecursiveArrayOfStrings = /** @class */ (function (_super) {
    __extends(RecursiveArrayOfStrings, _super);
    function RecursiveArrayOfStrings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RecursiveArrayOfStrings.merge = function (content) {
        var _this = this;
        var output = [];
        content.forEach(function (sub) {
            if (Array.isArray(sub)) {
                output.push(_this.merge(sub));
            }
            else {
                output.push(sub);
            }
        });
        return output.join('');
    };
    return RecursiveArrayOfStrings;
}(Array));
exports["default"] = RecursiveArrayOfStrings;
