"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("underscore");
class SummaryLine {
    constructor(params) {
        this.average = 0;
        this.perCent = 0;
        this.perMonth = [];
        if (params) {
            _.extend(this, params);
        }
    }
    combine(sl2) {
        this.average += parseFloat(sl2.average);
        this.sAverage = this.average.toString();
        this.perCent = parseFloat(this.perCent) + parseFloat(sl2.perCent);
        if (this.perMonth.length) {
            this.perMonth = _.map(this.perMonth, (el, index) => {
                el.value = parseFloat(el.value) + parseFloat(sl2.perMonth[index].value);
                el.value = el.value.toFixed(2);
                return el;
            });
        }
        else {
            this.perMonth = _.map(sl2.perMonth, _.clone);
        }
    }
}
exports.default = SummaryLine;
//# sourceMappingURL=SummaryLine.js.map