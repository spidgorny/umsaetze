"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Workspace_1 = __importDefault(require("./Workspace"));
const jquery_1 = __importDefault(require("jquery"));
const Backbone = require("backbone");
class Umsaetze {
    constructor() {
        this.router = new Workspace_1.default();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.router.init();
            console.log('document.location', document.location.pathname);
            const ok = Backbone.history.start({
                root: document.location.pathname,
            });
            if (!ok) {
                console.error('history start failed', this.router.routes);
            }
            this.inlineEdit();
        });
    }
    inlineEdit() {
        jquery_1.default(document).on('click', '.inlineEdit span', (event) => {
            let span = jquery_1.default(event.target);
            let container = span.parent();
            let input = container.find('input').show();
            span.hide();
            input.focus().val(span.text().trim());
            input.keyup((event) => {
                console.log(event.key);
                if (event.keyCode === 13) {
                    jquery_1.default(event.target).blur();
                }
            });
            input.blur((event) => {
                span.html(input.val().toString().trim());
                input.hide();
                span.show();
                let callback = container.data('callback');
                if (typeof callback == 'function') {
                    callback(event, container, container.text().trim());
                }
            });
        });
    }
    tour() {
    }
}
exports.Umsaetze = Umsaetze;
//# sourceMappingURL=Umsaetze.js.map