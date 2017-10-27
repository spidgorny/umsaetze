"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
var Umsaetze_1 = require("./Umsaetze");
console.log('Umsaetze', Umsaetze_1.Umsaetze);
if (typeof window == 'object' && window.__backboneAgent) {
    window.__backboneAgent.handleBackbone(Backbone);
}
$(function () {
    // setTimeout(() => {
    // const u = new Umsaetze();
    // }, 1);
});
var u = new Umsaetze_1.Umsaetze();
function asyncLoop(arr, callback, done) {
    (function loop(i) {
        //callback when the loop goes on
        callback(arr[i], i, arr.length);
        //the condition
        if (i < arr.length) {
            setTimeout(function () {
                loop(++i);
            }, 0); //rerun when condition is true
        }
        else {
            if (done) {
                //callback when the loop ends
                done();
            }
        }
    }(0)); //start with 0
}
exports.asyncLoop = asyncLoop;
function debug(name) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    console.warn.apply(console, [typeof name, ":"].concat(args));
}
exports.debug = debug;
// only run this once
// import ImportKeywords from './ImportKeywords';
// let i = new ImportKeywords();
