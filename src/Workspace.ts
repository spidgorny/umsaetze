///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
import AppView from './AppView';
import Sync from './Sync';
import MonthSelect from "./MonthSelect";
import Expenses from "./Expenses";
import CatPage from "./CatPage";
import CategoryCollection from "./CategoryCollection";

export default class Workspace extends Backbone.Router {

	routes = {
		"":             "AppView",
		"CatPage":		"CatPage",
		"sync":         "Sync",
	};

	model: Expenses;
	categoryList: CategoryCollection;

	app: AppView;
	syncPage: Sync;
	catPage: CatPage;

	constructor(options?: any) {
		super(options);
		(<any>this)._bindRoutes();
		this.model = new Expenses();
		this.model.fetch();
		this.categoryList = new CategoryCollection();
		this.categoryList.setExpenses(this.model);
	}

	AppView() {
		console.log('AppView');
		if (!this.app) {
			this.app = new AppView({
				model: this.model,
				categoryList: this.categoryList,
			});
			this.app.render();
		} else {
			this.app.show();
		}
	}

	Sync() {
		console.log('Sync');
		if (this.app) {
			this.app.hide();
		}
		if (!this.syncPage) {
			this.syncPage = new Sync(this.model);
		}
		this.syncPage.render();

		// quick testing
		// let ms: MonthSelect = new MonthSelect();
		// ms.render();
	}

	CatPage() {
		if (!this.catPage) {
			this.catPage = new CatPage(this.model, this.categoryList);
		}
		this.catPage.render();
	}

}
