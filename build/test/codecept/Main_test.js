"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const expect = require("expect");
const log = console.log;
Feature('Main');
Scenario('home empty', (I) => __awaiter(this, void 0, void 0, function* () {
    I.amOnPage('/');
    I.waitForElement('#expenseTable', 5);
    I.see('Dashboard');
    I.see('Sync');
    I.see('Categories');
    I.see('Keywords');
    I.see('Summary');
    I.see('History');
    I.saveScreenshot('Home.png', true);
    let logs = yield I.grabBrowserLogs();
    logs = logs.filter(el => el._type == 'error');
    log('errors', logs);
}));
Scenario('generate', (I) => __awaiter(this, void 0, void 0, function* () {
    I.amOnPage('/');
    I.waitForElement('#expenseTable', 5);
    I.click('Sync', 'ul#side-menu');
    I.waitForElement('#Refresh', 5);
    I.saveScreenshot('Sync.png', true);
    I.click('#Generate');
    I.saveScreenshot('Sync-Generate.png', true);
    const Jan = yield I.grabAttributeFrom('#month-01 button', 'disabled');
    log(Jan);
    expect(Jan).toBe(null);
}));
//# sourceMappingURL=Main_test.js.map