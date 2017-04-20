
export default class MockStorage {

	length: number = 0;

	getItem($name) {
		return this[name];
	}

	setItem(name, value) {
		this[name] = value;
		this.length++;
	}

}
