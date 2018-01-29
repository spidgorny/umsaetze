"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Window_1 = require("./DOM/Window");
global['window'] = new Window_1.default();
const Workspace_1 = require("../Workspace");
class TestNewWorkspace {
    constructor() {
        new Workspace_1.default();
    }
}
new TestNewWorkspace();
//# sourceMappingURL=newWorkspace.js.map