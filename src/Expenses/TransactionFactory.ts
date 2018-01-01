import Expenses from "./Expenses";
import Transaction from "./Transaction";
import Workspace from "../Workspace";

export class TransactionFactory {

	constructor(protected expenses: Expenses) {
	}

	make(attributes: any) {
		const t = new Transaction(attributes);
		t.expenses = this.expenses;
		t.init();
		return t;
	}

}
