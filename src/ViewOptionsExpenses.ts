import Expenses from "./Expenses/Expenses";
import ViewOptions = Backbone.ViewOptions;
import {Model} from "backbone";

export interface ViewOptionsExpenses<T extends Model> extends ViewOptions<T> {
	collection: Expenses;
}
