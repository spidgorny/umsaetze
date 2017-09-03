import Transaction from "./Expenses/Transaction";
import {Collection, Model} from "backbone";
import Expenses from "./Expenses/Expenses";

export default class CollectionController<T extends Expenses> extends Backbone.Events {

	$(selector: string): JQuery;
	el: any;
	$el: JQuery;

	hide() {
		this.$el.hide();
	}

}
