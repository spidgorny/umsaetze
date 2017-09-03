"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var CollectionController = /** @class */ (function (_super) {
    __extends(CollectionController, _super);
    function CollectionController(options) {
        var _this = _super.call(this) || this;
        _this.cid = _.uniqueId('view');
        _this.delegateEventSplitter = /^(\S+)\s*(.*)$/;
        _this.viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
        _this.cid = _.uniqueId('view');
        _.extend(_this, _.pick(options, _this.viewOptions));
        _this._ensureElement();
        return _this;
    }
    CollectionController.prototype.$ = function (selector) {
        return $(selector);
    };
    CollectionController.prototype._ensureElement = function () {
        if (!this.el) {
            var attrs = _.extend({}, _.result(this, 'attributes'));
            if (this.id)
                attrs.id = _.result(this, 'id');
            if (this.className)
                attrs['class'] = _.result(this, 'className');
            this.setElement(this._createElement(_.result(this, 'tagName')));
            this._setAttributes(attrs);
        }
        else {
            this.setElement(_.result(this, 'el'));
        }
    };
    CollectionController.prototype._createElement = function (tagName) {
        return document.createElement(tagName);
    };
    CollectionController.prototype._setAttributes = function (attributes) {
        this.$el.attr(attributes);
    };
    CollectionController.prototype.setElement = function (element) {
        this.undelegateEvents();
        this._setElement(element);
        this.delegateEvents();
        return this;
    };
    // Creates the `this.el` and `this.$el` references for this view using the
    // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
    // context or an element. Subclasses can override this to utilize an
    // alternative DOM manipulation API and are only required to set the
    // `this.el` property.
    CollectionController.prototype._setElement = function (el) {
        this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
        this.el = this.$el[0];
    };
    CollectionController.prototype.undelegateEvents = function () {
        if (this.$el)
            this.$el.off('.delegateEvents' + this.cid);
        return this;
    };
    CollectionController.prototype.delegateEvents = function (events) {
        events || (events = _.result(this, 'events'));
        if (!events)
            return this;
        this.undelegateEvents();
        for (var key in events) {
            var method = events[key];
            if (!_.isFunction(method))
                method = this[method];
            if (!method)
                continue;
            var match = key.match(this.delegateEventSplitter);
            this.delegate(match[1], match[2], _.bind(method, this));
        }
        return this;
    };
    CollectionController.prototype.delegate = function (eventName, selector, listener) {
        this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
        return this;
    };
    CollectionController.prototype.hide = function () {
        this.$el.hide();
    };
    return CollectionController;
}(Backbone.Events));
exports["default"] = CollectionController;
//# sourceMappingURL=CollectionController.js.map