"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const backbone_1 = require("backbone");
const Backbone = require('backbone');
class CollectionController extends backbone_1.Events {
    init(options) {
        this.cid = Math.random().toString();
    }
    setElement(el) {
        this.$el = el;
    }
    hide() {
        this.$el.hide();
    }
    static $(selector) {
        return $(selector);
    }
}
exports.CollectionController = CollectionController;
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
//# sourceMappingURL=CollectionController.js.map