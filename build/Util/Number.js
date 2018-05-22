"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accounting_js_1 = require("accounting-js");
const _ = require("underscore");
function detectFloat(source) {
    if (_.isUndefined(source))
        return NaN;
    let float = accounting_js_1.unformat(source);
    let posComma = source.indexOf(',');
    if (posComma > -1) {
        let posDot = source.indexOf('.');
        if (posDot > -1 && posComma > posDot) {
            let germanFloat = accounting_js_1.unformat(source, ',');
            if (Math.abs(germanFloat) > Math.abs(float)) {
                float = germanFloat;
            }
        }
        else {
            float = accounting_js_1.unformat(source, ',');
        }
    }
    return float;
}
exports.detectFloat = detectFloat;
Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};
function clamp(self, min, max) {
    return Math.min(Math.max(self, min), max);
}
exports.clamp = clamp;
//# sourceMappingURL=Number.js.map