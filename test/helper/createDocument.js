///<reference path="../../typings/globals/node/index.d.ts"/>
"use strict";
var jsdom_1 = require('jsdom');
function createDocument() {
    var document = jsdom_1.jsdom(undefined);
    var window = document.defaultView;
    global.document = document;
    global.window = window;
    Object.keys(window).forEach(function (key) {
        if (!(key in global)) {
            global[key] = window[key];
        }
    });
    return document;
}
exports.__esModule = true;
exports["default"] = createDocument;
//# sourceMappingURL=createDocument.js.map