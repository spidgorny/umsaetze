"use strict";
/// <reference path="../../typings/index.d.ts" />
exports.__esModule = true;
var _ = require('underscore');
var SummaryLine = /** @class */ (function () {
    function SummaryLine(params) {
        this.average = 0;
        this.perCent = 0;
        this.perMonth = [];
        if (params) {
            _.extend(this, params);
        }
    }
    SummaryLine.prototype.combine = function (sl2) {
        this.average += parseFloat(sl2.average);
        this.perCent = parseFloat(this.perCent) + parseFloat(sl2.perCent);
        if (this.perMonth.length) {
            this.perMonth = _.map(this.perMonth, function (el, index) {
                // if (this.catName == 'Auto') console.log(el, sl2.perMonth[index]);
                el.value = parseFloat(el.value) + parseFloat(sl2.perMonth[index].value);
                // if (this.catName == 'Auto') console.log(el.value);
                el.value = el.value.toFixed(2);
                return el;
            });
        }
        else {
            // http://stackoverflow.com/questions/21003059/how-do-you-clone-an-array-of-objects-using-underscore
            this.perMonth = _.map(sl2.perMonth, _.clone); // deep clone
        }
    };
    return SummaryLine;
}());
exports["default"] = SummaryLine;
//# sourceMappingURL=SummaryLine.js.map