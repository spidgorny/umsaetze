require('source-map-support').install();
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
//# sourceMappingURL=bootstrap.js.map