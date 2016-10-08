/// <reference path="../../typings/index.d.ts"/>
const simpleStorage = require('simpleStorage.js');
const _ = require('underscore');

export default class Collection extends Array {

	name: string;

	models = [];

	modelClass: any;

	constructor() {
		super(arguments);
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
		console.log(this.name+' saved '+this.size()+' records');
	}

	each(callback: Function) {
		this.models.forEach((el) => {
			//console.log('each', el);
			callback(el);
		});
	}

	getJSON() {
		return JSON.stringify(this.models, null, '\t');
	}

	size() {
		return this.models.length;
	}

	random() {
		return _.sample(this.models);
	}

}
