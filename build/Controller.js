"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Backbone = require('backbone');
class Controller extends Backbone.View {
    constructor(options) {
        super(options);
        this.visible = false;
    }
    show() {
        this.visible = true;
    }
    hide() {
        this.$el.hide();
        this.visible = false;
    }
}
exports.default = Controller;
//# sourceMappingURL=Controller.js.map