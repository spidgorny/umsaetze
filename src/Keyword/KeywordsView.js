"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Backbone = require('backbone');
var $ = require('jquery');
var KeywordsView = (function (_super) {
    __extends(KeywordsView, _super);
    function KeywordsView() {
        _super.call(this);
        this.$el = $('#app');
    }
    KeywordsView.prototype.render = function () {
        var content = this.keywords.getJSON();
        this.$el.html('<pre>' + content + '</pre>');
    };
    return KeywordsView;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = KeywordsView;
//# sourceMappingURL=KeywordsView.js.map