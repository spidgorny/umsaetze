import AppView from './Expenses/AppView';
import Sync from './Sync/Sync';
import Expenses from './Expenses/Expenses';
import {CatPage} from './Category/CatPage';
import {KeywordsView} from './Keyword/KeywordsView';
import CategoryCollection from './Category/CategoryCollection';
import KeywordCollection from './Keyword/KeywordCollection';
import SummaryView from './Summary/SummaryView';
import HistoryView from './History/HistoryView';
import Controller from './Controller';
import {CollectionController} from './CollectionController';
import $ from 'jquery';
import MonthSelect from "./MonthSelect/MonthSelect";
import {TransactionFactory} from "./Expenses/TransactionFactory";
import {LocalStorage} from 'backbone.localstorage';
import * as _ from 'underscore';
import {TotalPage} from "./Totals/TotalPage";
import Backbone = require('backbone');
import RouterOptions = Backbone.RouterOptions;

const log = require('ololog');

export default class Workspace extends Backbone.Router {

	routes = {
		'': 'AppView',
		':year/:month': 'MonthSelect',
		':year/:month/:category': 'MonthSelectCategory',
		'CatPage': 'CatPage',
		'Sync': 'Sync',
		'Keywords': 'Keywords',
		'Summary': 'Summary',
		'History': 'History',
		'TotalPage': '__not_a_function__',
	};

	model: Expenses;
	categoryList: CategoryCollection;
	keywords: KeywordCollection;
	tf: TransactionFactory;

	appPage: AppView;
	syncPage: Sync;
	catPage: CatPage;
	keywordsPage: KeywordsView;
	summaryPage: SummaryView;
	historyPage: HistoryView;
	TotalPage: TotalPage;

	currentPage: Controller<any> | CollectionController<Expenses> | SummaryView | HistoryView;

	static instance: Workspace;

	fragment: string;

	static getInstance() {
		return Workspace.instance;
	}

	constructor(options?: RouterOptions) {
		super(options);
		Workspace.instance = this;

		(this as any)._bindRoutes();
	}

	async init() {
		const expensesStorage = new LocalStorage("Expenses");
		log(expensesStorage.findAll().length);
		this.model = new Expenses([], {}, expensesStorage, null);
		this.tf = new TransactionFactory(this.model);
		this.model.tf = this.tf;
		// setTimeout(() => {
			await this.model.asyncFetch();
			const monthSelect = MonthSelect.getInstance();
			monthSelect.update(this.model);
		// }, 0);

		let ls = new LocalStorage(CategoryCollection.LS_KEY);
		let catList: any[] = ls.findAll();
		// log('catList', catList);
		this.categoryList = new CategoryCollection(catList);
		this.categoryList.setExpenses(this.model);

		this.keywords = new KeywordCollection();
		console.log('this.keywords', this.keywords.size());

		this.TotalPage = new TotalPage({
			expenses: this.model
		});
	}

	activateMenu() {
		this.activateMenu2();
	}

	activateMenu2() {
		// console.group('activateMenu');
		let url = '#' + window.location.hash;
		// var element = $('ul.nav a').filter(function() {
		//     return this.href == url;
		// }).addClass('active').parent().parent().addClass('in').parent();
		let element: JQuery =
			$('ul.nav#side-menu a')
			.removeClass('active')
			.filter(function () {
				let href = $(this).attr('href');
				// console.log(href, url);
				return href === url;
			})
			.addClass('active');
		let liElement = element
			.parent()
			.removeClass('in');

		//while (true) {
		// 	console.log(element, liElement);

			if (liElement.length && liElement.is('li')) {
				element = liElement.parent().addClass('in').parent();
			} else {
				//break;
			}
		//}
		// console.groupEnd();
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
			}, this.categoryList, this.keywords, MonthSelect.getInstance());
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
			this.syncPage = new Sync(this.model, this, this.tf);
		}
		this.syncPage.show();
		this.currentPage = this.syncPage;
	}

	CatPage() {
		console.warn('CatPage');
		this.activateMenu();
		this.hideCurrentPage();
		if (!this.catPage) {
			this.catPage = new CatPage(this.model, this.categoryList);
		}
		this.catPage.show();
		this.currentPage = this.catPage;
	}

	Keywords() {
		console.warn('Keywords');
		this.activateMenu();
		this.hideCurrentPage();
		if (!this.keywordsPage) {
			this.keywordsPage = new KeywordsView(this.keywords, this.categoryList);
		}
		this.keywordsPage.show();
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
			this.appPage.table.model.setCategory(cat);
			this.appPage.collection.trigger('change');	// slow!
		}
	}

	Summary() {
		console.warn('Summary');
		this.activateMenu();
		this.hideCurrentPage();
		if (!this.summaryPage) {
			// const categoryModel = new CategoryCollectionModel(this.categoryList);
			this.summaryPage = new SummaryView({
				collection: this.categoryList,
			}, this.model);
		}
		$('#pieChart').hide();
		$('#categories').hide();
		this.summaryPage.show();
		this.currentPage = this.summaryPage;
	}

	History() {
		console.warn('History');
		this.activateMenu();
		this.hideCurrentPage();
		if (!this.historyPage) {
			this.historyPage = new HistoryView({
				collection: this.model
			});
		}
		$('#pieChart').hide();
		$('#categories').hide();
		this.historyPage.show();
		this.currentPage = this.historyPage;
	}

	/**
	 * Copy/paste to call my own _extractParameters()
	 * @param route
	 * @param name
	 * @param callback
	 */
	route(route: string | RegExp, name: string, callback?: Function): Backbone.Router {
		if (!_.isRegExp(route)) route = this._routeToRegExp2(route);
		if (_.isFunction(name)) {
			callback = name;
			name = '';
		}
		if (!callback) callback = this[name];
		Backbone.history.route(route, (fragment) => {
			log('route callback', fragment);
			this.fragment = fragment;
			var args = this._extractParameters2(route, fragment);
			if (this.execute(callback, args, name) !== false) {
				this.trigger.apply(this, ['route:' + name].concat(args));
				this.trigger('route', name, args);
				Backbone.history.trigger('route', this, name, args);
			}
		});
		return this;
	}

	optionalParam = /\((.*?)\)/g;
	namedParam    = /(\(\?)?:\w+/g;
	splatParam    = /\*\w+/g;
	escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

	/**
	 * Just copy/paste of the original
	 * @param route
	 * @private
	 */
	private _routeToRegExp2(route) {
		route = route.replace(this.escapeRegExp, '\\$&')
			.replace(this.optionalParam, '(?:$1)?')
			.replace(this.namedParam, function(match, optional) {
				return optional ? match : '([^/?]+)';
			})
			.replace(this.splatParam, '([^?]*?)');
		return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
	}

	private _extractParameters2(route, fragment): string[] {
		// below is copy/paste from the original private method
		// damn the private methods
		const params: string[] = route.exec(fragment).slice(1);
		return _.map(params, function(param, i) {
			// Don't decode the search params.
			if (i === params.length - 1) return param || null;
			return param ? decodeURIComponent(param) : null;
		});
	}

	/**
	 * I just want to get hold of 'fragment' to allow dynamic page routing
	 * @param callback
	 * @param args
	 * @param name
	 */
	execute(callback, args, name): boolean
	{
		log('execute', callback, args, name);
		console.log('fragment', this.fragment);

		// original line
		// super.execute(callback, args, name);

		if (callback) {
			return callback.apply(this, args);
		} else {
			this.ShowPage(this.fragment);
		}
		return false;
	}

	/**
	 * Can open any page by fragment.
	 * Is the default function for any route (but not called with any fragment)
	 * @param fragment
	 * @constructor
	 */
	ShowPage(fragment) {
		if (!fragment) {
			return;
		}
		console.warn(fragment);
		this.activateMenu();
		this.hideCurrentPage();
		if (this[fragment]) {
			this[fragment].show();
			this.currentPage = this[fragment];
		} else {
			throw new Error('undefined Workspace page: '+fragment);
		}
	}

}
