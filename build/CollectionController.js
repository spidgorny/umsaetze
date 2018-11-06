"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jquery_1 = __importDefault(require("jquery"));
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
        return jquery_1.default(selector);
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