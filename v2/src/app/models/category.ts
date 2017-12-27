export class Category {

	name: string;
	count = 0;
	amount = 0;
	totalCount = 0;
	totalAmount = 0;
	color: string = Category.pastelColor();
	total = 1;
	averagePerMonth: number;
	sparkLine: object;

	static pastelColor() {
		const r = (Math.round(Math.random() * 55) + 200).toString(16);
		const g = (Math.round(Math.random() * 55) + 200).toString(16);
		const b = (Math.round(Math.random() * 55) + 200).toString(16);
		return '#' + r + g + b;
	}

	constructor(props: any) {
		this.name = props.name;
		this.count = props.count || 0;
		this.amount = props.amount || 0;
		this.color = props.color || Category.pastelColor();
	}

	get money(): string {
		return (this.amount).toFixed(2);
	}

	get sign() {
		return this.amount >= 0 ? 'positive' : 'negative';
	}

	get width(): string {
		return Math.abs(this.amount / this.total * 100).toFixed(2);
	}

	get average() {
		return this.amount / this.count;
	}

	values(object) {
		return Object.keys(object).map(key => object[key]);
	}

	getAverageAmountPerMonth(totalsPerMonth: Object) {
		const totals = this.values(totalsPerMonth);
		const sum = totals.reduce((a, b) => {
			return parseFloat(a) + parseFloat(b);
		});
		return sum / totals.length;
	}

}
