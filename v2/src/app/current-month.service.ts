import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class CurrentMonthService {

	public messageSource = new BehaviorSubject<Date>(new Date());
	value = this.messageSource.asObservable();

	constructor() {
	}

	emitChange(newDate: Date) {
		this.messageSource.next(newDate);
	}

}
