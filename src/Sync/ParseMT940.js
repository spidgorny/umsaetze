/// <reference path="../../typings/index.d.ts" />
"use strict";
var ParseMT940 = (function () {
    function ParseMT940(data) {
        // http://stackoverflow.com/questions/8936984/uint8array-to-string-in-javascript
        this.data = String.fromCharCode.apply(null, data);
    }
    ParseMT940.prototype.parseAndNormalize = function () {
        console.log(this.data);
        var lines = this.data.split(/[\r\n]+/);
        this.data = null; // memory
        var tag;
        var data;
        var flow = [];
        lines.forEach(function (row) {
            var parts = row.match(/:([^:]+):(.+)/);
            if (parts.length == 3) {
                if (tag) {
                    flow.push({
                        tag: tag,
                        data: data,
                    });
                }
                tag = parts[1];
                data = parts[2];
            }
            else {
                data += row;
            }
        });
        if (tag) {
            flow.push({
                tag: tag,
                data: data,
            });
        }
        console.log(flow);
        return flow;
    };
    return ParseMT940;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParseMT940;
