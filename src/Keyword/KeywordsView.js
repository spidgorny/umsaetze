/// <reference path="../../typings/index.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var RecursiveArrayOfStrings_1 = require('../RecursiveArrayOfStrings');
var toastr = require('toastr');
var KeywordsView = (function (_super) {
    __extends(KeywordsView, _super);
    function KeywordsView() {
        _super.call(this);
        this.$el = $('#app');
    }
    KeywordsView.prototype.render = function () {
        console.time('KeywordsView::render');
        var content = ['<table class="table">',
            '<thead>',
            '<tr>',
            '<th>Keyword</th>',
            '<th>Category</th>',
            '</tr>',
            '</thead>',
        ];
        content.push('<tbody>');
        this.keywords.each(function (el) {
            content.push([
                '<tr>',
                '<td>', el.word, '</td>',
                '<td>', el.category, '</td>',
                '</tr>',
            ]);
        });
        content.push('</tbody>');
        content.push('</table>');
        // console.log(content);
        content = [
            ("<div class=\"panel panel-default\">\n\t\t\t\t<div class=\"panel-heading\">\n\t\t\t\t\t<div class=\"pull-right\">\n\t\t\t\t\t\t<button class=\"btn btn-default btn-xs\" id=\"removeDuplicates\">\n\t\t\t\t\t\t<span class=\"glyphicon glyphicon-filter\"></span>\n\t\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t\tKeywords \n\t\t\t\t<span class=\"badge\">" + this.keywords.size() + "</span>\n\t\t\t</div>\n\t\t\t<div class=\"panel-body\">"),
            content,
            '</div>',
            '</div>',
        ];
        this.$el.html(RecursiveArrayOfStrings_1["default"].merge(content));
        this.$('#removeDuplicates').off().on('click', this.removeDuplicates.bind(this));
        console.timeEnd('KeywordsView::render');
    };
    KeywordsView.prototype.removeDuplicates = function (event) {
        var original = this.keywords.size();
        console.log('removeDuplicates', original);
        this.keywords.models = _.uniq(this.keywords.models, false, function (el) {
            return el.word;
        });
        console.log(this.keywords.size());
        var x = this.keywords.size() - original;
        if (x) {
            toastr.success("Removed " + x + " duplicates");
        }
        else {
            toastr.error("No duplicates to remove");
        }
        this.keywords.save();
        this.render();
    };
    return KeywordsView;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = KeywordsView;
//# sourceMappingURL=KeywordsView.js.map