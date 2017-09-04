import Transaction from "./Expenses/Transaction";
import {Collection, Model, Events} from "backbone";
import Expenses from "./Expenses/Expenses";
import CollectionArray from "./Keyword/CollectionArray";
import EventsHash = Backbone.EventsHash;

export class CollectionController<T extends Expenses|CollectionArray> implements Events {

	// Regular expression used to split event strings.
	eventSplitter = /\s+/;

	_listenId = _.uniqueId('l');

	_listeningTo = {};

	_events = {};

	_listeners = {};

	// Iterates over the standard `event, callback` (as well as the fancy multiple
	// space-separated events `"change blur", callback` and jQuery-style event
	// maps `{event: callback}`).
	eventsApi(iteratee, events, name, callback, opts) {
		let i = 0, names;
		if (name && typeof name === 'object') {
			// Handle event maps.
			if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
			for (names = _.keys(name); i < names.length ; i++) {
				events = this.eventsApi(iteratee, events, names[i], name[names[i]], opts);
			}
		} else if (name && this.eventSplitter.test(name)) {
			// Handle space-separated event names by delegating them individually.
			for (names = name.split(this.eventSplitter); i < names.length; i++) {
				events = iteratee(events, names[i], callback, opts);
			}
		} else {
			// Finally, standard events.
			events = iteratee(events, name, callback, opts);
		}
		return events;
	}

	on(eventName: string, callback?: Function, context?: any): any;
	on(eventMap: EventsHash): any;

	// Bind an event to a `callback` function. Passing `"all"` will bind
	// the callback to all events fired.
	on(name: string | EventsHash, callback?: Function, context?: any) {
		return this.internalOn(this, name, callback, context, null);
	}

	// Guard the `listening` argument from the public API.
	internalOn(obj, name, callback, context, listening) {
		obj._events = this.eventsApi(this.onApi, obj._events || {}, name, callback, {
			context: context,
			ctx: obj,
			listening: listening
		});

		if (listening) {
			let listeners = obj._listeners || (obj._listeners = {});
			listeners[listening.id] = listening;
		}

		return obj;
	}

	// Inversion-of-control versions of `on`. Tell *this* object to listen to
	// an event in another object... keeping track of what it's listening to
	// for easier unbinding later.
	listenTo(obj, name, callback?) {
		if (!obj) return this;
		const id = obj._listenId || (obj._listenId = _.uniqueId('l'));
		const listeningTo = this._listeningTo || (this._listeningTo = {});
		let listening = listeningTo[id];

		// This object is not listening to any other events on `obj` yet.
		// Setup the necessary references to track the listening callbacks.
		if (!listening) {
			const thisId = this._listenId || (this._listenId = _.uniqueId('l'));
			listening = listeningTo[id] = {obj: obj, objId: id, id: thisId, listeningTo: listeningTo, count: 0};
		}

		// Bind callbacks on obj, and keep track of them on listening.
		this.internalOn(obj, name, callback, this, listening);
		return this;
	}

	// The reducing API that adds a callback to the `events` object.
	onApi(events, name, callback, options) {
		if (callback) {
			var handlers = events[name] || (events[name] = []);
			var context = options.context, ctx = options.ctx, listening = options.listening;
			if (listening) listening.count++;

			handlers.push({callback: callback, context: context, ctx: context || ctx, listening: listening});
		}
		return events;
	}

	// Remove one or many callbacks. If `context` is null, removes all
	// callbacks with that function. If `callback` is null, removes all
	// callbacks for the event. If `name` is null, removes all bound
	// callbacks for all events.
	off(name, callback, context) {
		if (!this._events) return this;
		this._events = this.eventsApi(this.offApi, this._events, name, callback, {
			context: context,
			listeners: this._listeners
		});
		return this;
	}

	// Tell this object to stop listening to either specific events ... or
	// to every object it's currently listening to.
	stopListening(obj, name, callback) {
		const listeningTo = this._listeningTo;
		if (!listeningTo) return this;

		let ids = obj ? [obj._listenId] : _.keys(listeningTo);

		for (let i = 0; i < ids.length; i++) {
			let listening = listeningTo[ids[i]];

			// If listening doesn't exist, this object is not currently
			// listening to obj. Break out early.
			if (!listening) break;

			listening.obj.off(name, callback, this);
		}

		return this;
	}

	// The reducing API that removes a callback from the `events` object.
	offApi(events, name, callback, options) {
		if (!events) return;

		let i = 0, listening;
		let context = options.context, listeners = options.listeners;

		// Delete all events listeners and "drop" events.
		if (!name && !callback && !context) {
			let ids = _.keys(listeners);
			for (; i < ids.length; i++) {
				listening = listeners[ids[i]];
				delete listeners[listening.id];
				delete listening.listeningTo[listening.objId];
			}
			return;
		}

		let names = name ? [name] : _.keys(events);
		for (; i < names.length; i++) {
			name = names[i];
			let handlers = events[name];

			// Bail out if there are no events stored.
			if (!handlers) break;

			// Replace events if there are any remaining.  Otherwise, clean up.
			let remaining = [];
			for (let j = 0; j < handlers.length; j++) {
				let handler = handlers[j];
				if (
					callback && callback !== handler.callback &&
					callback !== handler.callback._callback ||
					context && context !== handler.context
				) {
					remaining.push(handler);
				} else {
					listening = handler.listening;
					if (listening && --listening.count === 0) {
						delete listeners[listening.id];
						delete listening.listeningTo[listening.objId];
					}
				}
			}

			// Update tail event if the list has any events.  Otherwise, clean up.
			if (remaining.length) {
				events[name] = remaining;
			} else {
				delete events[name];
			}
		}
		return events;
	}

	// Bind an event to only be triggered a single time. After the first time
	// the callback is invoked, its listener will be removed. If multiple events
	// are passed in using the space-separated syntax, the handler will fire
	// once for each event, not once for a combination of all events.
	once(name, callback, context) {
		// Map the event into a `{event: once}` object.
		let events = this.eventsApi(this.onceMap, {}, name, callback, _.bind(this.off, this));
		if (typeof name === 'string' && context == null) callback = void 0;
		return this.on(events, callback, context);
	}

	// Inversion-of-control versions of `once`.
	listenToOnce(obj, name, callback) {
		// Map the event into a `{event: once}` object.
		let events = this.eventsApi(this.onceMap, {}, name, callback, _.bind(this.stopListening, this, obj));
		return this.listenTo(obj, events);
	}

	// Reduces the event callbacks into a map of `{event: onceWrapper}`.
	// `offer` unbinds the `onceWrapper` after it has been called.
	onceMap(map, name, callback, offer) {
		if (callback) {
			const once = map[name] = _.once(function() {
				offer(name, once);
				callback.apply(this, arguments);
			});
			//once._callback = callback;
		}
		return map;
	}

	// Trigger one or many events, firing all bound callbacks. Callbacks are
	// passed the same arguments as `trigger` is, apart from the event name
	// (unless you're listening on `"all"`, which will cause your callback to
	// receive the true name of the event as the first argument).
	trigger(name) {
		if (!this._events) return this;

		var length = Math.max(0, arguments.length - 1);
		var args = Array(length);
		for (var i = 0; i < length; i++) args[i] = arguments[i + 1];

		this.eventsApi(this.triggerApi, this._events, name, void 0, args);
		return this;
	}

	// Handles triggering the appropriate event callbacks.
	triggerApi(objEvents, name, callback, args) {
		if (objEvents) {
			var events = objEvents[name];
			var allEvents = objEvents.all;
			if (events && allEvents) allEvents = allEvents.slice();
			if (events) this.triggerEvents(events, args);
			if (allEvents) this.triggerEvents(allEvents, [name].concat(args));
		}
		return objEvents;
	}

	// A difficult-to-believe, but optimized internal dispatch function for
	// triggering events. Tries to keep the usual cases speedy (most internal
	// Backbone events have 3 arguments).
	triggerEvents(events, args) {
		var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
		switch (args.length) {
			case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
			case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
			case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
			case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
			default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
		}
	}

	bind(name: string | EventsHash, callback?: Function, context?: any) {
		console.error('bind is deprecated');
		// if ((typeof name) == 'string') {
		// 	this.on(name, callback, context);
		// } else {
		// 	this.on(name);
		// }
	}

	unbind(name, callback, context) {
		this.off(name, callback, context);
	}


	cid;
	id: string;
	className: string;
	el: any;
	$el: JQuery;
	delegateEventSplitter = /^(\S+)\s*(.*)$/;
	viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
	collection: Expenses;

	constructor(options?) {
		applyMixins(this, [Events]);
		//su per(); // it has no constructor
		this.cid = _.uniqueId('view');
		_.extend(this, _.pick(options, this.viewOptions));
		this._ensureElement();
	}

	$(selector: string) {
		return $(selector);
	}

	_ensureElement() {
		if (!this.el) {
			const attrs = _.extend({}, _.result(this, 'attributes'));
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
		for (let key in events) {
			let method = events[key];
			if (!_.isFunction(method)) method = this[method];
			if (!method) continue;
			const match = key.match(this.delegateEventSplitter);
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

function applyMixins(derivedCtor: any, baseCtors: any[]) {
	baseCtors.forEach(baseCtor => {
		Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
			derivedCtor.prototype[name] = baseCtor.prototype[name];
		});
	});
}

