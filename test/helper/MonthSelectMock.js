"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MonthSelect_1 = require("../../src/MonthSelect");
var MockStorage_1 = require("./MockStorage");
var MonthSelectMock = (function (_super) {
    __extends(MonthSelectMock, _super);
    function MonthSelectMock() {
        this.storageProvider = new MockStorage_1.default();
        _super.call(this);
    }
    return MonthSelectMock;
}(MonthSelect_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MonthSelectMock;
