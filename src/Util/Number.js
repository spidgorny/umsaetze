import { _ } from 'underscore';
export function detectFloat(source) {
    if (_.isUndefined(source))
        return NaN;
    var float = accounting.unformat(source);
    var posComma = source.indexOf(',');
    if (posComma > -1) {
        var posDot = source.indexOf('.');
        if (posDot > -1 && posComma > posDot) {
            var germanFloat = accounting.unformat(source, ',');
            if (Math.abs(germanFloat) > Math.abs(float)) {
                float = germanFloat;
            }
        }
        else {
            float = accounting.unformat(source, ',');
        }
    }
    return float;
}
Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};
//# sourceMappingURL=Number.js.map