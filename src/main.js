import * as $ from "jquery";
import { Umsaetze } from './Umsaetze';
console.log('Umsaetze', Umsaetze);
if (typeof window == 'object' && window.__backboneAgent) {
    window.__backboneAgent.handleBackbone(Backbone);
}
$(function () {
});
var u = new Umsaetze();
export function asyncLoop(arr, callback, done) {
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
export function debug(name) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    console.warn.apply(console, [typeof name, ":"].concat(args));
}
//# sourceMappingURL=main.js.map