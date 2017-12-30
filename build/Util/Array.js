"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("underscore");
Array.prototype.average = function () {
    if (this.length) {
        const sum = _.reduce(this, (a, b) => {
            return '' + (parseFloat(a) + parseFloat(b));
        });
        let avg = parseFloat(sum) / this.length;
        return avg.toFixed(2);
    }
    else {
        return null;
    }
};
//# sourceMappingURL=Array.js.map