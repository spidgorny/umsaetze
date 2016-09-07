///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
import AppView from './AppView';
import Sync from './Sync';

export default class Workspace extends Backbone.Router {

	routes = {
		"":            "AppView",
		"help":        "help",
		"sync":        "sync",
	};

	constructor(options?: any) {
		super(options);
		this._bindRoutes();
	}

	AppView() {
		console.log('AppView');
		var app = new AppView();
		app.render();
	}

	help() {
		console.log('help()');
	}

	sync() {
		var sync = new Sync();
		sync.render();
	}

}
