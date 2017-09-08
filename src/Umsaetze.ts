import Workspace from './Workspace';
import Backbone from 'backbone-es6/src/Backbone.js';
import $ from 'jquery';
import Tour from 'bootstrap-tour';

export default class Umsaetze {

	router: Workspace;

	constructor() {
		this.router = new Workspace();
		console.log('Umsaetze.router', this.router);

		const ok = Backbone.history.start({
			root: '/umsaetze/docs/web/'
		});
		console.log('history.start', ok);
		if (!ok) {
			console.log(Backbone.history.routes);
		}

		this.inlineEdit();
		this.tour();
		console.log('Umsaetze.constructor() done');
	}

	inlineEdit() {
		$(document).on('click', '.inlineEdit span', (event) => {
			let span = $(event.target);
			let container = span.parent();
			let input = container.find('input').show();
			span.hide();
			input.focus().val(span.text().trim());
			input.keyup((event) => {
				console.log(event.key);
				if (event.keyCode === 13) {
					$(event.target).blur();
				}
			});
			input.blur((event) => {
				span.html(input.val().trim());
				input.hide();
				span.show();
				let callback = container.data('callback');
				if (typeof callback == 'function') {
					callback(event, container, container.text().trim());
				}
			});
		});
	}

	tour() {
		let tour = new Tour({
			steps: [
				{
					element: "#app",
					title: "Let me show you how it works",
					content: "Here you will see all your expenses in a selected month."
				},
			]});

		setTimeout(() => {
			// Initialize the tour
			// tour.init();
			// Start the tour
			// tour.start();
		}, 5);
	}

}
