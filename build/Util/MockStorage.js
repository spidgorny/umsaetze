"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MockStorage {
    constructor() {
        this.length = 0;
    }
    getItem($name) {
        return this[name];
    }
    setItem(name, value) {
        this[name] = value;
        this.length++;
    }
    _clear() {
        for (let i in Object.getOwnPropertyNames(this)) {
            delete this[i];
        }
        this.length = 0;
    }
    update(object) {
    }
}
exports.default = MockStorage;
//# sourceMappingURL=MockStorage.js.map