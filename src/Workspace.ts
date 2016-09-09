///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
import AppView from './AppView';
import Sync from './Sync';
import MonthSelect from "./MonthSelect";
import Expenses from "./Expenses";

export default class Workspace extends Backbone.Router {

	routes = {
		"":            "AppView",
		"help":        "help",
		"sync":        "sync",
	};

	app: AppView;
	syncPage: Sync;
	model: Expenses;

	constructor(options?: any) {
		super(options);
		(<any>this)._bindRoutes();
		this.model = new Expenses();
		this.model.fetch();
	}

	AppView() {
		console.log('AppView');
		if (!this.app) {
			this.app = new AppView({
				model: this.model
			});
			this.app.render();
		} else {
			this.app.show();
		}
	}

	help() {
		console.log('help()');
	}

	sync() {
		console.log('Sync');
		if (this.app) {
			this.app.hide();
		}
		if (!this.syncPage) {
			this.syncPage = new Sync(this.model);
		}
		this.syncPage.render();

		// quick testing
		let ms: MonthSelect = new MonthSelect();
		ms.render();
	}

}
