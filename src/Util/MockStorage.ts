import {LocalStorageInterface} from "../test/helper/LocalStorageInterface";

export default class MockStorage implements LocalStorageInterface {

	protected length: number = 0;

	findAll() {
		return this;
	}

	getItem($name) {
		return this[name];
	}

	setItem(name, value) {
		this[name] = value;
		this.length++;
	}

	_clear() {
		for (let i in Object.getOwnPropertyNames(this)) {
			delete this[i];
		}
		this.length = 0;
	}

	update(object: any) {

	}

	clear() {
		this._clear();
	}

	key(index) {
		return '';
	}

	removeItem(index) {

	}

	[key: string]: any;
	[index: number]: string;

}
