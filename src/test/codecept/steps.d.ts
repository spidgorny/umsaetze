
type ICodeceptCallback = (i: CodeceptJS.I) => void;

declare class FeatureConfig {
  retry(integer): FeatureConfig
  timeout(integer): FeatureConfig
  config(object): FeatureConfig
  config(string, object): FeatureConfig
}

declare class ScenarioConfig {
  throws(any) : ScenarioConfig;
  fails() : ScenarioConfig;
  retry(integer): ScenarioConfig
  timeout(integer): ScenarioConfig
  inject(object): ScenarioConfig
  config(object): ScenarioConfig
  config(string, object): ScenarioConfig
}

interface ILocator {
  xpath?: string;
  css?: string;
  name?: string;
  value?: string;
  frame?: string;
  android?: string;
  ios?: string;
}

declare class Locator implements ILocator {
  or(locator): Locator;
  find(locator): Locator;
  withChild(locator): Locator;
  find(locator): Locator;
  at(position): Locator;
  first(): Locator;
  last(): Locator;
  inside(locator): Locator;
  before(locator): Locator;
  after(locator): Locator;
  withText(text): Locator;
  withAttr(attr): Locator;
  as(output): Locator;
}

declare function actor(customSteps?: {}): CodeceptJS.I;
declare function Feature(string: string, opts?: {}): FeatureConfig;
declare function Scenario(string: string, callback: ICodeceptCallback): ScenarioConfig;
declare function Scenario(string: string, opts: {}, callback: ICodeceptCallback): ScenarioConfig;
declare function xScenario(string: string, callback: ICodeceptCallback): ScenarioConfig;
declare function xScenario(string: string, opts: {}, callback: ICodeceptCallback): ScenarioConfig;
declare function Data(data: any): any;
declare function xData(data: any): any;
declare function Before(callback: ICodeceptCallback): void;
declare function BeforeSuite(callback: ICodeceptCallback): void;
declare function After(callback: ICodeceptCallback): void;
declare function AfterSuite(callback: ICodeceptCallback): void;

declare function locate(selector: string): Locator;
declare function locate(selector: ILocator): Locator;
declare function within(selector: string, callback: Function): Promise;
declare function within(selector: ILocator, callback: Function): Promise;
declare function session(selector: string, callback: Function): Promise;
declare function session(selector: ILocator, callback: Function): Promise;
declare function session(selector: string, config: any, callback: Function): Promise;
declare function session(selector: ILocator, config: any, callback: Function): Promise;

declare const codecept_helper: any;

declare namespace CodeceptJS {
  export interface I {
    amAcceptingPopups() : void,
    acceptPopup() : void,
    amCancellingPopups() : void,
    cancelPopup() : void,
    seeInPopup(text: string) : void,
    grabPopupText() : Promise,
    amOnPage(url: string) : void,
    resizeWindow(width: number, height: number) : void,
    haveRequestHeaders(customHeaders: string) : void,
    moveCursorTo(locator: ILocator, offsetX?: string, offsetY?: string) : void,
    moveCursorTo(locator: string, offsetX?: string, offsetY?: string) : void,
    dragAndDrop(source: string, destination: string) : void,
    refreshPage() : void,
    scrollPageToTop() : void,
    scrollPageToBottom() : void,
    scrollTo(locator: ILocator, offsetX?: string, offsetY?: string) : void,
    scrollTo(locator: string, offsetX?: string, offsetY?: string) : void,
    seeInTitle(text: string) : void,
    grabPageScrollPosition() : Promise,
    seeTitleEquals(text: string) : void,
    dontSeeInTitle(text: string) : void,
    grabTitle() : Promise,
    switchToNextTab(num?: number) : void,
    switchToPreviousTab(num?: number) : void,
    closeCurrentTab() : void,
    closeOtherTabs() : void,
    openNewTab() : void,
    grabNumberOfOpenTabs() : Promise,
    seeElement(locator: ILocator, undefined: string) : void,
    dontSeeElement(locator: ILocator, undefined: string) : void,
    seeElementInDOM(locator: ILocator, undefined: string) : void,
    dontSeeElementInDOM(locator: ILocator, undefined: string) : void,
    click(locator: ILocator, context?: ILocator) : void,
    click(locator: string, context?: ILocator) : void,
    click(locator: ILocator, context?: string) : void,
    click(locator: string, context?: string) : void,
    doubleClick(locator: ILocator, context?: ILocator) : void,
    doubleClick(locator: string, context?: ILocator) : void,
    doubleClick(locator: ILocator, context?: string) : void,
    doubleClick(locator: string, context?: string) : void,
    rightClick(locator: ILocator, context?: ILocator) : void,
    rightClick(locator: string, context?: ILocator) : void,
    rightClick(locator: ILocator, context?: string) : void,
    rightClick(locator: string, context?: string) : void,
    checkOption(field: ILocator, context?: ILocator) : void,
    checkOption(field: string, context?: ILocator) : void,
    checkOption(field: ILocator, context?: string) : void,
    checkOption(field: string, context?: string) : void,
    seeCheckboxIsChecked(field: ILocator, undefined: string) : void,
    dontSeeCheckboxIsChecked(field: ILocator, undefined: string) : void,
    pressKey(key: string) : void,
    fillField(field: ILocator, value: string) : void,
    fillField(field: string, value: string) : void,
    clearField(field: ILocator, undefined: string) : void,
    appendField(field: ILocator, value: string) : void,
    appendField(field: string, value: string) : void,
    seeInField(field: ILocator, value: string) : void,
    seeInField(field: string, value: string) : void,
    dontSeeInField(field: ILocator, value: string) : void,
    dontSeeInField(field: string, value: string) : void,
    attachFile(locator: ILocator, pathToFile: string) : void,
    attachFile(locator: string, pathToFile: string) : void,
    selectOption(select: ILocator, option: string) : void,
    selectOption(select: string, option: string) : void,
    grabNumberOfVisibleElements(locator: ILocator, undefined: string) : Promise,
    seeInCurrentUrl(url: string) : void,
    dontSeeInCurrentUrl(url: string) : void,
    seeCurrentUrlEquals(url: string) : void,
    dontSeeCurrentUrlEquals(url: string) : void,
    see(text: string, context?: ILocator) : void,
    see(text: string, context?: string) : void,
    seeTextEquals(text: string, context?: ILocator) : void,
    seeTextEquals(text: string, context?: string) : void,
    dontSee(text: string, context?: ILocator) : void,
    dontSee(text: string, context?: string) : void,
    grabSource() : Promise,
    grabBrowserLogs() : Promise,
    grabCurrentUrl() : Promise,
    seeInSource(text: string) : void,
    dontSeeInSource(text: string) : void,
    seeNumberOfElements(selector: string, num: number) : void,
    seeNumberOfVisibleElements(locator: ILocator, num: number) : void,
    seeNumberOfVisibleElements(locator: string, num: number) : void,
    setCookie(cookie: string) : void,
    seeCookie(name: string) : void,
    dontSeeCookie(name: string) : void,
    grabCookie(name: string) : Promise,
    clearCookie(name: string) : void,
    executeScript(fn: Function) : void,
    executeAsyncScript(fn: Function) : void,
    grabTextFrom(locator: ILocator, undefined: string) : Promise,
    grabValueFrom(locator: ILocator, undefined: string) : Promise,
    grabHTMLFrom(locator: ILocator, undefined: string) : Promise,
    grabCssPropertyFrom(locator: ILocator, cssProperty: string) : Promise,
    grabCssPropertyFrom(locator: string, cssProperty: string) : Promise,
    seeCssPropertiesOnElements(locator: ILocator, cssProperties: string) : void,
    seeCssPropertiesOnElements(locator: string, cssProperties: string) : void,
    seeAttributesOnElements(locator: ILocator, attributes: string) : void,
    seeAttributesOnElements(locator: string, attributes: string) : void,
    grabAttributeFrom(locator: ILocator, attr: string) : Promise,
    grabAttributeFrom(locator: string, attr: string) : Promise,
    saveScreenshot(fileName: string, fullPage: boolean = false) : void,
    wait(sec: number) : void,
    waitForEnabled(locator: ILocator, sec: number) : void,
    waitForEnabled(locator: string, sec: number) : void,
    waitForValue(locator: ILocator, value: string, sec: number) : void,
    waitForValue(locator: string, value: string, sec: number) : void,
    waitNumberOfVisibleElements(locator: ILocator, num: number, sec: number) : void,
    waitNumberOfVisibleElements(locator: string, num: number, sec: number) : void,
    waitForElement(locator: ILocator|string, sec: number = 1) : void,
    waitForElement(locator: string, sec: number) : void,
    waitForVisible(locator: ILocator, sec: number) : void,
    waitForVisible(locator: string, sec: number) : void,
    waitForInvisible(locator: ILocator, sec: number) : void,
    waitForInvisible(locator: string, sec: number) : void,
    waitToHide(locator: ILocator, sec: number) : void,
    waitToHide(locator: string, sec: number) : void,
    waitInUrl(urlPart: string, sec?: number) : void,
    waitUrlEquals(urlPart: string, sec?: number) : void,
    waitForText(text: string, sec?: number, context?: ILocator) : void,
    waitForText(text: string, sec?: number, context?: string) : void,
    switchTo(locator: ILocator, undefined: string) : void,
    waitUntil(fn: Function, sec?: number) : void,
    waitUntilExists(locator: ILocator, sec: number) : void,
    waitUntilExists(locator: string, sec: number) : void,
    waitForDetached(locator: ILocator, sec: number) : void,
    waitForDetached(locator: string, sec: number) : void,
    debug(msg: string) : void,
    debugSection(section: string, msg: string) : void,

  }
}

declare module "codeceptjs" {
    export = CodeceptJS;
}
