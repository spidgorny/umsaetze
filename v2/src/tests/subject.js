"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Subject_1 = require("rxjs/Subject");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var subject = new Subject_1.Subject();
subject.subscribe(function (value) { return console.log('Received new subject value: '); });
subject.next(123);
var behaviorSubject = new BehaviorSubject_1.BehaviorSubject('initialState');
var currentValue = behaviorSubject.getValue();
console.log(currentValue);
//# sourceMappingURL=subject.js.map