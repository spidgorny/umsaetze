import Expenses from "../Expenses/Expenses";

export class Totals {

	visible: boolean = false;

	expenses: Expenses;

	constructor(expenses: Expenses) {
		this.expenses = expenses;
	}

	show() {
		this.visible = true;
		this.render();
	}

	hide() {
		this.visible = false;
	}

	render() {
		console.log('Totals');
	}

}
