module Backbone {
	export default class Singleton {

		_instance: any;

		public getInstance() {
			if (this._instance === undefined) {
				this._instance = new this();
			}
			return this._instance;
		}
	}
}
