///<reference path="../typings/index.d.ts"/>
const simpleStorage = require('simpleStorage.js');

export default class Collection {

	name: string;

	models = [];

	modelClass: any;

	constructor() {
		this.name = this.constructor.name;
	}

	/**
	 * Call this after setting this.modelClass
	 */
	fetch() {
		let models = simpleStorage.get(this.name) || [];
		models.forEach((row) => {
			let model = new this.modelClass(row);
			this.add(model);
		});
	}

	add(model) {
		this.models.push(model);
		this.save();
	}

	save() {
		simpleStorage.set(this.name, this.models);
	}

	each(callback: Function) {
		this.models.forEach((el) => {
			//console.log('each', el);
			callback(el);
		});
	}

}
