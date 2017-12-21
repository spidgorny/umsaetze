import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

let subject = new Subject();
subject.subscribe(value => console.log('Received new subject value: '));
subject.next(123);


let behaviorSubject = new BehaviorSubject('initialState');
let currentValue = behaviorSubject.getValue();
console.log(currentValue);
