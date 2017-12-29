
export default class MockStorage {

	length: number = 0;

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
