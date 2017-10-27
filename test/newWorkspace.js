"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Window_1 = require("./Window");
global.window = new Window_1.default();
var Workspace_1 = require("../src/Workspace");
var TestNewWorkspace = /** @class */ (function () {
    function TestNewWorkspace() {
        new Workspace_1.default();
    }
    return TestNewWorkspace;
}());
new TestNewWorkspace();
