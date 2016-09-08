///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
import AppView from './AppView';
import Sync from './Sync';

export default class Workspace extends Backbone.Router {

	routes = {
		"":            "AppView",
		"help":        "help",
		"sync":        "sync",
	};

	app: AppView;
	syncPage: Sync;

	constructor(options?: any) {
		super(options);
		this._bindRoutes();
	}

	AppView() {
		console.log('AppView');
		if (!this.app) {
			this.app = new AppView();
			this.app.render();
		} else {
			this.app.show();
		}
	}

	help() {
		console.log('help()');
	}

	sync() {
		if (this.app) {
			this.app.hide();
		}
		if (!this.syncPage) {
			this.syncPage = new Sync();
		}
		this.syncPage.render();
	}

}
