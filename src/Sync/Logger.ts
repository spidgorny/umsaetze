export class Logger {

	callback: Function;

	constructor(callback: Function) {
		this.callback = callback;
	}

	log(line) {
		this.callback(line);
	}


}
