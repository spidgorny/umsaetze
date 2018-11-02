"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MonthSelect_1 = require("../../MonthSelect/MonthSelect");
const MockStorage_1 = require("../../Util/MockStorage");
class MonthSelectMock extends MonthSelect_1.default {
    constructor() {
        super();
        this.storageProvider = new MockStorage_1.default();
    }
}
exports.default = MonthSelectMock;
//# sourceMappingURL=MonthSelectMock.js.map