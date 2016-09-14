///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
import AppView from './AppView';
import Sync from './Sync';
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

	activateMenu() {
		var url = window.location;
		// var element = $('ul.nav a').filter(function() {
		//     return this.href == url;
		// }).addClass('active').parent().parent().addClass('in').parent();
		var element = $('ul.nav#side-menu a')
			.removeClass('active')
			.filter(function() {
				return this.href == url;
			})
			.addClass('active')
			.parent()
			.removeClass('in');

		while (true) {
			if (element.is('li')) {
				element = element.parent().addClass('in').parent();
			} else {
				break;
			}
		}
	}

	AppView() {
		console.log('AppView');
		this.activateMenu();
		if (!this.app) {
			this.app = new AppView({
				model: this.model,
				categoryList: this.categoryList,
			});
		}
		this.app.show();
	}

	Sync() {
		console.log('Sync');
		this.activateMenu();
		if (this.app) {
			this.app.hide();
		}
		if (!this.syncPage) {
			this.syncPage = new Sync(this.model);
			this.syncPage.router = this;
		}
		this.syncPage.render();

		// quick testing
		// let ms: MonthSelect = new MonthSelect();
		// ms.render();
	}

	CatPage() {
		console.log('CatPage');
		this.activateMenu();
		if (this.app) {
			this.app.hide();
		}
		if (!this.catPage) {
			this.catPage = new CatPage(this.model, this.categoryList);
		}
		this.catPage.render();
	}

}
