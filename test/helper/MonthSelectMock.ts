
import MonthSelect from "../../src/MonthSelect";
import MockStorage from "./MockStorage";

export default class MonthSelectMock extends MonthSelect {

	constructor() {
		this.storageProvider = new MockStorage();
		super();
	}

}
