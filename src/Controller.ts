import Transaction from "./Expenses/Transaction";
import {Model} from "backbone";
const Backbone = require('backbone');

export default class Controller<T extends Model> extends Backbone.View<T> {

	hide() {
		this.$el.hide();
	}

}
