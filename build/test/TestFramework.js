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
            this.runTest(method);
            this[method].call(this);
        }
    }
    runTest(method) {
        console.log('');
        console.log('=== ', method, ' ===');
    }
    error(message, must, is) {
        console.error(message);
    }
    assert(b, message) {
        if (!b) {
            this.error(message, true, b);
        }
    }
    assertEquals(must, is, message) {
        if (must != is) {
            this.error(message, must, is);
        }
    }
}
exports.default = TestFramework;
//# sourceMappingURL=TestFramework.js.map