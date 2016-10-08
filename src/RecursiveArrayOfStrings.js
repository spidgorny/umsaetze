"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RecursiveArrayOfStrings = (function (_super) {
    __extends(RecursiveArrayOfStrings, _super);
    function RecursiveArrayOfStrings() {
        _super.apply(this, arguments);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RecursiveArrayOfStrings;
//# sourceMappingURL=RecursiveArrayOfStrings.js.map