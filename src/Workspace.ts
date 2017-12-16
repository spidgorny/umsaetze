import AppView from './AppView';
import Sync from './Sync/Sync';
import Expenses from './Expenses/Expenses';
import { CatPage } from './CatPage';
import { KeywordsView } from './Keyword/KeywordsView';
import CategoryCollection from './Category/CategoryCollection';
import RouterOptions = Backbone.RouterOptions;
import KeywordCollection from './Keyword/KeywordCollection';
import SummaryView from './Summary/SummaryView';
import HistoryView from './History/HistoryView';
// import Backbone from 'backbone-es6/src/Backbone.js';
import Backbone = require('backbone');
import Controller from './Controller';
import { CollectionController } from './CollectionController';
import * as $ from 'jquery';
// import * as _ from 'underscore';

export default class Workspace extends Backbone.Router {

	routes = {
		'': 'AppView',
		':year/:month': 'MonthSelect',
		':year/:month/:category': 'MonthSelectCategory',
		'CatPage': 'CatPage',
		'Sync': 'Sync',
		'Keywords': 'Keywords',
		'Summary': 'Summary',
		'History': 'History'
	};

	model: Expenses;
	categoryList: CategoryCollection;
	keywords = new KeywordCollection();

	appPage: AppView;
	syncPage: Sync;
	catPage: CatPage;
	keywordsPage: KeywordsView;
	summaryPage: SummaryView;
	historyPage: HistoryView;

	currentPage: Controller<any> | CollectionController<Expenses>;

	constructor(options?: RouterOptions) {
		super(options);
		(this as any)._bindRoutes();
		this.model = new Expenses();
		this.model.fetch();
		this.categoryList = new CategoryCollection();
		this.categoryList.setExpenses(this.model);
	}

	activateMenu() {
		let url = window.location.href;
		// var element = $('ul.nav a').filter(function() {
		//     return this.href == url;
		// }).addClass('active').parent().parent().addClass('in').parent();
		let element: JQuery =
			$('ul.nav#side-menu a')
			.removeClass('active')
			.filter(function () {
				return $(this).attr('href') == url;
			})
			.addClass('active');
		let liElement = element
			.parent()
			.removeClass('in');

		while (true) {
			if (liElement.is('li')) {
				element = liElement.parent().addClass('in').parent();
			} else {
				break;
			}
		}
	}

	hideCurrentPage() {
		if (this.currentPage) {
			this.currentPage.hide();
		}
	}

	AppView() {
		console.warn('AppView');
		this.activateMenu();
		this.hideCurrentPage();
		if (!this.appPage) {
			this.appPage = new AppView({
				viewCollection: this.model
			}, this.categoryList);
			this.appPage.table.keywords = this.keywords;
		}
		this.appPage.show();
		this.currentPage = this.appPage;
	}

	Sync() {
		console.warn('Sync');
		this.activateMenu();
		this.hideCurrentPage();
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
		this.currentPage = this.syncPage;
	}

	CatPage() {
		console.warn('CatPage');
		this.activateMenu();
		this.hideCurrentPage();
		if (!this.catPage) {
			this.catPage = new CatPage(this.model, this.categoryList);
		}
		this.catPage.render();
		this.currentPage = this.catPage;
	}

	Keywords() {
		console.warn('Keywords');
		this.activateMenu();
		this.hideCurrentPage();
		if (!this.keywordsPage) {
			this.keywordsPage = new KeywordsView();
			this.keywordsPage.keywords = this.keywords;
		}
		this.keywordsPage.render();
		this.currentPage = this.keywordsPage;
	}

	MonthSelect(year, month) {
		console.warn('MonthSelect', year, month);
		if (parseInt(year) && parseInt(month)) {
			this.AppView();
			this.appPage.ms.setYearMonth(year, month);
		}
	}

	MonthSelectCategory(year, month, category) {
		console.warn('MonthSelectCategory', year, month, category);
		if (parseInt(year) && parseInt(month)) {
			this.AppView();
			this.appPage.ms.setYearMonth(year, month);
			let cat = this.categoryList.findWhere({catName: category});
			console.log('MonthSelectCategory cat', cat);
			this.appPage.collection.filterByCategory(cat);
			this.appPage.collection.trigger('change');	// slow!
		}
	}

	Summary() {
		console.log('Summary');
		this.activateMenu();
		this.hideCurrentPage();
		if (!this.summaryPage) {
			this.summaryPage = new SummaryView({
				collection: this.categoryList
			}, this.model);
		}
		$('#pieChart').hide();
		$('#categories').hide();
		this.summaryPage.render();
		this.currentPage = this.summaryPage;
	}

	History() {
		console.log('History');
		this.activateMenu();
		this.hideCurrentPage();
		if (!this.historyPage) {
			this.historyPage = new HistoryView({
				collection: this.model
			});
		}
		$('#pieChart').hide();
		$('#categories').hide();
		this.historyPage.render();
		this.currentPage = this.historyPage;
	}

}
