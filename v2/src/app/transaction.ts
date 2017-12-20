export class Transaction {

	id: string;
	date: Date;
	amount: Number;
	category: String;
	note: String;

	constructor(json: any) {
		this.id = json.id;
		this.date = new Date(json.date);
		this.amount = parseFloat(json.amount);
		this.category = json.category || 'Default';
		this.note = json.note;
	}

	get sign() {
		return this.amount >= 0 ? 'positive' : 'negative';
	}

	getDate() {
		return this.date;
	}

	save() {

	}

}
