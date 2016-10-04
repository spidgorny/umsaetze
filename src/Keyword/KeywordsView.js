/// <reference path="../../typings/index.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Backbone = require('backbone');
var $ = require('jquery');
var RecursiveArrayOfStrings_1 = require('../RecursiveArrayOfStrings');
var KeywordsView = (function (_super) {
    __extends(KeywordsView, _super);
    function KeywordsView() {
        _super.call(this);
        this.$el = $('#app');
    }
    KeywordsView.prototype.render = function () {
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
            '<div class="panel panel-default">',
            '<div class="panel-heading">',
            '<div class="pull-right">',
            '<button class="btn btn-default btn-xs" id="removeDuplicates">',
            '<span class="glyphicon glyphicon-filter"></span>',
            '</button>',
            '</div>',
            'Kywords ',
            '<span class="badge">', this.keywords.size(), '</span>',
            '</div>',
            '<div class="panel-body">',
            content,
            '</div>',
            '</div>',
        ];
        this.$el.html(RecursiveArrayOfStrings_1["default"].merge(content));
        this.$('#removeDuplicates').on('click', this.removeDuplicates.bind(this));
    };
    KeywordsView.prototype.removeDuplicates = function (event) {
    };
    return KeywordsView;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = KeywordsView;
//# sourceMappingURL=KeywordsView.js.map