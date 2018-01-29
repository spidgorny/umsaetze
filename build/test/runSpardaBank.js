"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SpardaBank_1 = require("./SpardaBank");
require('source-map-support').install();
const util = require('util');
const stream = require('stream');
const fs = require('fs');
const iconv = require('iconv-lite');
const _ = require('underscore');
function StringifyStream() {
    stream.Transform.call(this);
    this._readableState.objectMode = false;
    this._writableState.objectMode = true;
}
util.inherits(StringifyStream, stream.Transform);
StringifyStream.prototype._transform = function (obj, encoding, cb) {
    this.push(JSON.stringify(obj));
    cb();
};
let sb = new SpardaBank_1.SpardaBank();
sb.startCategorize();
//# sourceMappingURL=runSpardaBank.js.map