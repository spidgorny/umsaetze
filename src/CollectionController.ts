import Transaction from "./Expenses/Transaction";
import {Collection, Model, Events} from "backbone";
import Expenses from "./Expenses/Expenses";
import CollectionArray from "./Keyword/CollectionArray";

export default class CollectionController<T extends Expenses|CollectionArray> extends Events {

	cid = _.uniqueId('view');

	$(selector: string) {
		return $(selector);
	}
	id: string;
	className: string;
	el: any;
	$el: JQuery;
	delegateEventSplitter = /^(\S+)\s*(.*)$/;
	viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
	collection: Expenses;

	constructor(options?) {
		super();
		this.cid = _.uniqueId('view');
		_.extend(this, _.pick(options, this.viewOptions));
		this._ensureElement();
	}

	_ensureElement() {
		if (!this.el) {
			var attrs = _.extend({}, _.result(this, 'attributes'));
			if (this.id) attrs.id = _.result(this, 'id');
			if (this.className) attrs['class'] = _.result(this, 'className');
			this.setElement(this._createElement(_.result(this, 'tagName')));
			this._setAttributes(attrs);
		} else {
			this.setElement(_.result(this, 'el'));
		}
	}

	_createElement(tagName) {
		return document.createElement(tagName);
	}

	_setAttributes(attributes) {
		this.$el.attr(attributes);
	}

	setElement(element) {
		this.undelegateEvents();
		this._setElement(element);
		this.delegateEvents();
		return this;
	}

	// Creates the `this.el` and `this.$el` references for this view using the
	// given `el`. `el` can be a CSS selector or an HTML string, a jQuery
	// context or an element. Subclasses can override this to utilize an
	// alternative DOM manipulation API and are only required to set the
	// `this.el` property.
	_setElement(el) {
		this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
		this.el = this.$el[0];
	}

	undelegateEvents() {
		if (this.$el) this.$el.off('.delegateEvents' + this.cid);
		return this;
	}

	delegateEvents(events?) {
		events || (events = _.result(this, 'events'));
		if (!events) return this;
		this.undelegateEvents();
		for (var key in events) {
			var method = events[key];
			if (!_.isFunction(method)) method = this[method];
			if (!method) continue;
			var match = key.match(this.delegateEventSplitter);
			this.delegate(match[1], match[2], _.bind(method, this));
		}
		return this;
	}

	delegate(eventName, selector, listener) {
		this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
		return this;
	}

	hide() {
		this.$el.hide();
	}

}
