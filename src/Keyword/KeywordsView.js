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
var $ = require("jquery");
var _ = require('underscore');
var RecursiveArrayOfStrings_1 = require("../RecursiveArrayOfStrings");
var toastr = require("toastr");
var CollectionController_1 = require("../CollectionController");
var KeywordsView = /** @class */ (function (_super) {
    __extends(KeywordsView, _super);
    function KeywordsView(options) {
        var _this = _super.call(this, options) || this;
        _this.$el = $('#app');
        console.log(_this);
        //console.log(super);
        console.log('new KeywordsView()', _this.cid);
        return _this;
    }
    KeywordsView.prototype.render = function () {
        console.time('KeywordsView::render');
        var content = ['<table class="table">',
            '<thead>',
            '<tr>',
            '<th>Keyword</th>',
            '<th>Category</th>',
            '<th></th>',
            '</tr>',
            '</thead>',
        ];
        content.push('<tbody>');
        this.keywords.each(function (el) {
            content.push("\n\t\t\t\t<tr data-id=\"" + el.word + "\">\n\t\t\t\t<td>" + el.word + "</td>\n\t\t\t\t<td>" + el.category + "</td>\n\t\t\t\t<td class=\"hover-btn\">\n\t\t\t\t\t<button type=\"button\" class=\"close btn-sm\" data-dismiss=\"alert\">\n\t\t\t\t\t\t<span aria-hidden=\"true\">\u00D7</span>\n\t\t\t\t\t\t<span class=\"sr-only\">Delete</span>\n\t\t\t\t\t</button>\n\t\t\t\t</td>\n\t\t\t\t</tr>");
        });
        content.push('</tbody>');
        content.push('</table>');
        // console.log(content);
        content = [
            "<div class=\"panel panel-default\">\n\t\t\t\t<div class=\"panel-heading\">\n\t\t\t\t\t<div class=\"pull-right\">\n\t\t\t\t\t\t<button class=\"btn btn-default btn-xs\" id=\"removeDuplicates\">\n\t\t\t\t\t\t\t<span class=\"glyphicon glyphicon-filter\"></span>\n\t\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t\tKeywords \n\t\t\t\t<span class=\"badge\">" + this.keywords.size() + "</span>\n\t\t\t</div>\n\t\t\t<div class=\"panel-body\">"
        ].concat(content, [
            '</div>',
            '</div>',
        ]);
        this.$el.html(RecursiveArrayOfStrings_1["default"].merge(content));
        this.$('#removeDuplicates').off().on('click', this.removeDuplicates.bind(this));
        this.$el.off('click', 'button.close').on('click', 'button.close', this.deleteRow.bind(this));
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
    KeywordsView.prototype.deleteRow = function (event) {
        var button = $(event.target);
        var dataID = button.closest('tr').attr('data-id');
        console.log(dataID);
        this.keywords.remove(dataID, 'word');
        this.keywords.save();
        this.render();
    };
    KeywordsView.prototype.hide = function () {
    };
    return KeywordsView;
}(CollectionController_1.CollectionController));
exports.KeywordsView = KeywordsView;
