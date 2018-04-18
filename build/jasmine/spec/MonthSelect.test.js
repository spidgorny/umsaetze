"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('source-map-support').install();
const log = console.log;
log.error = console.error;
function buildDOM1() {
    const dom = require('node-dom').dom;
    global.window = dom('', null, {});
    global.document = window.document;
}
function buildDOM2() {
    global['window'] = new Window();
    global['document'] = global['window'].document;
}
function buildDOM3() {
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const { window } = new JSDOM();
    const document = window.document;
    global['window'] = window;
    global['document'] = document;
}
function buildDOM4() {
    window = jsdom.jsdom().defaultView;
}
buildDOM3();
function buildStorage() {
}
const MonthSelect_1 = require("../../MonthSelect/MonthSelect");
describe('2B||!2B', () => {
    it('true ==? false', () => {
        expect(true).toBeTruthy();
    });
});
describe('Month Select', () => {
    it('can be instantiated', () => {
        const storage = require('local-storage-mock');
        log('storage', storage);
        let ms = new MonthSelect_1.default(storage);
        expect(ms.constructor.name).toBe('MonthSelect');
    });
});
//# sourceMappingURL=MonthSelect.test.js.map