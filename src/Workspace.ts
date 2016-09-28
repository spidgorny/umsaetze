///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>

import AppView from './AppView';
import Sync from './Sync';
import Expenses from "./Expenses";
import CatPage from "./CatPage";
import KeywordsView from "./KeywordsView";
import CategoryCollection from "./Category/CategoryCollection";
import RouterOptions = Backbone.RouterOptions;
import KeywordCollection from "./KeywordCollection";
let bb = require('backbone');
let $ = require('jquery');
// let _ = require('underscore');

export default class Workspace extends bb.Router {

	routes = {
		"":             			"AppView",
		":year/:month":				"MonthSelect",
		":year/:month/:category":	"MonthSelectCategory",
		"CatPage":					"CatPage",
		"Sync":         			"Sync",
		"Keywords":     			"Keywords",
	};

	model: Expenses;
	categoryList: CategoryCollection;
	keywords = new KeywordCollection();

	appPage: AppView;
	syncPage: Sync;
	catPage: CatPage;
	keywordsPage: KeywordsView;

	constructor(options?: RouterOptions) {
		super(options);
		(<any>this)._bindRoutes();
		this.model = new Expenses();
		this.model.fetch();
		this.categoryList = new CategoryCollection();
		this.categoryList.setExpenses(this.model);
	}

	activateMenu() {
		let url = window.location;
		// var element = $('ul.nav a').filter(function() {
		//     return this.href == url;
		// }).addClass('active').parent().parent().addClass('in').parent();
		let element = $('ul.nav#side-menu a')
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
		if (!this.appPage) {
			this.appPage = new AppView({
				collection: this.model,
				categoryList: this.categoryList,
			});
			this.appPage.table.keywords = this.keywords;
		}
		this.appPage.show();
	}

	Sync() {
		console.log('Sync');
		this.activateMenu();
		if (this.appPage) {
			this.appPage.hide();
		} else {
			$('#MonthSelect').hide();	// for consistency
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
		if (this.appPage) {
			this.appPage.hide();
		}
		if (!this.catPage) {
			this.catPage = new CatPage(this.model, this.categoryList);
		}
		this.catPage.render();
	}

	Keywords() {
		console.log('Keywords');
		this.activateMenu();
		if (this.appPage) {
			this.appPage.hide();
		}
		if (!this.keywordsPage) {
			this.keywordsPage = new KeywordsView();
			this.keywordsPage.keywords = this.keywords;
		}
		this.keywordsPage.render();
	}

	MonthSelect(year, month) {
		console.log('MonthSelect', year, month);
		this.AppView();
		this.appPage.ms.setYearMonth(year, month);
	}

	MonthSelectCategory(year, month, category) {
		console.log('MonthSelectCategory', year, month, category);
		this.AppView();
		this.appPage.ms.setYearMonth(year, month);
		let cat = this.categoryList.findWhere({catName: category});
		console.log('MonthSelectCategory cat', cat);
		this.appPage.collection.filterByCategory(cat);
		this.appPage.collection.trigger('change');	// slow!

	}

}
