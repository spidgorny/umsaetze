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
Object.defineProperty(exports, "__esModule", { value: true });
var expenses_base_1 = require("../app/datasource/expenses-base");
var ExpensesService4Test = /** @class */ (function (_super) {
    __extends(ExpensesService4Test, _super);
    function ExpensesService4Test(loader, saver) {
        var _this = _super.call(this, loader, saver) || this;
        _this.loader = loader;
        _this.saver = saver;
        return _this;
    }
    return ExpensesService4Test;
}(expenses_base_1.ExpensesBase));
exports.ExpensesService4Test = ExpensesService4Test;
//# sourceMappingURL=ExpensesService4Test.js.map