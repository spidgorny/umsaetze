import {LocalStorageInterface} from "./LocalStorageInterface";

export class FakeLocalStorage implements LocalStorageInterface {

	findAll() {
		return [];
	}

	_clear() {
	}

	update(data: any) {
	}
}

