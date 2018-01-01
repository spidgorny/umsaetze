import Expenses from "./Expenses";
import {Model, ViewOptions} from "backbone";

export interface ViewOptionsExpenses<T extends Model> extends ViewOptions<T> {
	viewCollection: Expenses;
}
