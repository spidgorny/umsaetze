import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CurrentMonthService {

	protected messageSource = new BehaviorSubject<Date>(new Date());
	public readonly value: Observable<Date> = this.messageSource.asObservable();

	constructor() {
	}

	subscribe(cb) {
		this.value.subscribe(cb);
	}

	emitChange(newDate: Date) {
		this.messageSource.next(newDate);
	}

	getValue() {
		return this.messageSource.getValue();
	}

}
