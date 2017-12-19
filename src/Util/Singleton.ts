module Backbone {
	export class Singleton {

		_instance: any;

		public getInstance() {
			if (this._instance === undefined) {
				// this._instance = new this();
				console.error('Singleton not working in TS');
			}
			return this._instance;
		}
	}
}
