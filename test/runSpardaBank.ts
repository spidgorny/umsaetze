// import sourceMapSupport from 'source-map-support';
// sourceMapSupport.install();

import {SpardaBank} from "./SpardaBank";

require('source-map-support').install();

const util = require('util');
const stream = require('stream');
const fs = require('fs');
const iconv = require('iconv-lite');
const _ = require('underscore');
import path = require('path');

function StringifyStream() {
	stream.Transform.call(this);

	this._readableState.objectMode = false;
	this._writableState.objectMode = true;
}
util.inherits(StringifyStream, stream.Transform);

StringifyStream.prototype._transform = function(obj, encoding, cb){
	this.push(JSON.stringify(obj));
	cb();
};

export declare class Record {

	account: string;
	category: string;
	currency: string;
	amount: string;
	payment_type: string;
	date: string;
	note: string;

}

let sb = new SpardaBank();
//sb.convertMoneyFormat();
sb.startCategorize();
