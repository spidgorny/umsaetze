// import {simplestorage as simpleStorage} from 'simplestorage.js';
const simpleStorage = require('simplestorage.js');
import * as _ from 'underscore';

export default class CollectionArray extends Array {

	name: string;

	models = [];

	modelClass: any;

	constructor(...arguments2) {
		super(...arguments2);
		this.name = this.constructor.prototype.name;
	}

	/**
	 * Call this after setting this.modelClass
	 */
	fetch() {
		let timerName = 'CollectionArray.fetch: ' + this.modelClass.constructor.name;
		console.time(timerName);
		let models = simpleStorage.get(this.name) || [];
		console.log('adding', models.length);
		models.forEach((row) => {
			if (row) {
				let model = new this.modelClass(row);
				// this.add(model); // will save
				this.models.push(model); // will not save
			}
		});
		console.timeEnd(timerName);
	}

	add(model) {
		this.models.push(model);
		this.save();
	}

	save() {
		simpleStorage.set(this.name, this.models);
		//console.log(this.name+' saved '+this.size()+' records');
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

	remove(id, idField = 'id') {
		console.log(this.models);
		let index = _.findIndex(this.models, el => {
			return el[idField] == id;
		});
		console.log('remove', id, index, idField);
		if (index > -1) {
			// this leaves empty as element of array
			//delete this.models[index];
			this.models.splice(index, 1);
		}
	}

}
