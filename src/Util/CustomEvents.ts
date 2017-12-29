import {Events} from "backbone";

const _ = require('underscore');

/**
 * https://stackoverflow.com/questions/37333323/how-can-i-extend-backbone-events-in-a-typescript-es6-class
 */

export class CustomEvents {
	constructor() {
		_.extend(this, Events);
	}

	on(eventName: string, callback?: Function, context?: any): any {
		return;
	}

	off(eventName?: string, callback?: Function, context?: any): any {
		return;
	}

	trigger(eventName: string, ...args: any[]): any {
		return;
	}

	bind(eventName: string, callback: Function, context?: any): any {
		return;
	}

	unbind(eventName?: string, callback?: Function, context?: any): any {
		return;
	}

	once(events: string, callback: Function, context?: any): any {
		return;
	}

	listenTo(object: any, events: string, callback: Function): any {
		return;
	}

	listenToOnce(object: any, events: string, callback: Function): any {
		return;
	}

	stopListening(object?: any, events?: string, callback?: Function): any {
		return;
	}

}
