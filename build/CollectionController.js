"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JQuery = require("jquery");
const CustomEvents_1 = require("./Util/CustomEvents");
class CollectionController extends CustomEvents_1.CustomEvents {
    constructor(options) {
        super();
        this.visible = false;
    }
    init(options) {
        this.cid = Math.random().toString();
    }
    setElement(el) {
        this.$el = el;
    }
    show() {
        this.visible = true;
    }
    hide() {
        this.$el.hide();
        this.visible = false;
    }
    static $(selector) {
        return JQuery(selector);
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