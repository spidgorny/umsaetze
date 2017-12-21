export class Category {

	name: string;
	count: number = 0;
	amount: number = 0;
	color: string = Category.pastelColor();

	constructor(props: any) {
		this.name = props.name;
		this.count = props.count || 0;
		this.amount = props.amount || 0;
		this.color = props.color || Category.pastelColor();
	}

	static pastelColor() {
		let r = (Math.round(Math.random() * 55) + 200).toString(16);
		let g = (Math.round(Math.random() * 55) + 200).toString(16);
		let b = (Math.round(Math.random() * 55) + 200).toString(16);
		return '#' + r + g + b;
	}

	get sign() {
		return this.amount >= 0 ? 'positive' : 'negative';
	}

	get width() {
		return 50;
	}

}
