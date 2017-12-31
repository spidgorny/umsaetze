import MonthSelect from "../../MonthSelect/MonthSelect";
import MockStorage from "../../Util/MockStorage";

export default class MonthSelectMock extends MonthSelect {

	constructor() {
		super();
		this.storageProvider = new MockStorage();
	}

}
