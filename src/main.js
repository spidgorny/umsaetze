"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
const Umsaetze_1 = require("./Umsaetze");
require("toastr/build/toastr.css");
console.log('Umsaetze', Umsaetze_1.Umsaetze);
if (typeof window == 'object' && window.__backboneAgent) {
    window.__backboneAgent.handleBackbone(Backbone);
}
$(() => {
});
const u = new Umsaetze_1.Umsaetze();
function asyncLoop(arr, callback, done) {
    (function loop(i) {
        callback(arr[i], i, arr.length);
        if (i < arr.length) {
            setTimeout(function () {
                loop(++i);
            }, 0);
        }
        else {
            if (done) {
                done();
            }
        }
    }(0));
}
exports.asyncLoop = asyncLoop;
function debug(name, ...args) {
    console.warn(typeof name, ":", ...args);
}
exports.debug = debug;
//# sourceMappingURL=main.js.map