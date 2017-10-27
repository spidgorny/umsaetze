import { _ } from "underscore";
var SummaryLine = (function () {
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
                el.value = parseFloat(el.value) + parseFloat(sl2.perMonth[index].value);
                el.value = el.value.toFixed(2);
                return el;
            });
        }
        else {
            this.perMonth = _.map(sl2.perMonth, _.clone);
        }
    };
    return SummaryLine;
}());
export default SummaryLine;
//# sourceMappingURL=SummaryLine.js.map