"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const backbone_1 = require("backbone");
const _ = require('underscore');
class CustomEvents {
    constructor() {
        _.extend(this, backbone_1.Events);
    }
    on(eventName, callback, context) {
        return;
    }
    ;
    off(eventName, callback, context) {
        return;
    }
    ;
    trigger(eventName, ...args) {
        return;
    }
    ;
    bind(eventName, callback, context) {
        return;
    }
    ;
    unbind(eventName, callback, context) {
        return;
    }
    ;
    once(events, callback, context) {
        return;
    }
    ;
    listenTo(object, events, callback) {
        return;
    }
    ;
    listenToOnce(object, events, callback) {
        return;
    }
    ;
    stopListening(object, events, callback) {
        return;
    }
    ;
}
exports.CustomEvents = CustomEvents;
//# sourceMappingURL=CustomEvents.js.map