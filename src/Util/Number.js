"use strict";
var accounting_js_1 = require('accounting-js');
var _ = require('underscore');
function detectFloat(source) {
    if (_.isUndefined(source))
        return NaN;
    var float = accounting_js_1.unformat(source);
    var posComma = source.indexOf(',');
    if (posComma > -1) {
        var posDot = source.indexOf('.');
        if (posDot > -1 && posComma > posDot) {
            var germanFloat = accounting_js_1.unformat(source, ',');
            if (Math.abs(germanFloat) > Math.abs(float)) {
                float = germanFloat;
            }
        }
        else {
            // source = source.replace(/,/g, '.');
            float = accounting_js_1.unformat(source, ',');
        }
    }
    return float;
}
exports.detectFloat = detectFloat;
Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};
