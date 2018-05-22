"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
const Umsaetze_1 = require("./Umsaetze");
const Backbone = require('backbone');
if (typeof window == 'object' && window.__backboneAgent) {
    window.__backboneAgent.handleBackbone(Backbone);
}
$(() => {
});
(() => __awaiter(this, void 0, void 0, function* () {
    const u = new Umsaetze_1.Umsaetze();
    yield u.init();
    window.app = u;
}))();
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
function awaitLoop(array, callback, done) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let el of array) {
            yield callback(el);
        }
        if (done) {
            yield done();
        }
    });
}
exports.awaitLoop = awaitLoop;
function debug(name, ...args) {
    console.warn(typeof name, ":", ...args);
}
exports.debug = debug;
//# sourceMappingURL=main.js.map