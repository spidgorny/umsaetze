
import MonthSelect from "../../src/MonthSelect";
import MockStorage from "../../src/Util/MockStorage";

export default class MonthSelectMock extends MonthSelect {

	constructor() {
		super();
		this.storageProvider = new MockStorage();
	}

}
