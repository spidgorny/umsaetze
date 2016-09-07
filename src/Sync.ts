///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
///<reference path="../typings/index.d.ts"/>

export default class Sync extends Backbone.View<> {

	template = _.template($('#SyncPage').html());

	render() {
		$('#app').html(this.template());
	}

}
