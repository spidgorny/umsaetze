import Transaction from "./Expenses/Transaction";
import {Model} from "backbone";
const Backbone = require('backbone');

export default class Controller<T extends Model> extends Backbone.View<T> {

	visible = false;

	constructor(options: any) {
		super(options);
	}

	show() {
		this.visible = true;
	}

	hide() {
		this.$el.hide();
		this.visible = false;
	}

}
