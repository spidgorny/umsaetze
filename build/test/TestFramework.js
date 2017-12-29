"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TestFramework {
    constructor() {
    }
    run() {
        let testFunctions = [];
        for (let p in this) {
            if (typeof this[p] === 'function' && p.indexOf('test') == 0) {
                testFunctions.push(p);
            }
        }
        for (let method of testFunctions) {
            console.log('=== ', method, ' ===');
            this[method].call(this);
        }
    }
    assertEquals(must, is, message) {
        if (must != is) {
            console.error(message, must, is);
        }
    }
}
exports.default = TestFramework;
//# sourceMappingURL=TestFramework.js.map