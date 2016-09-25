/// <reference path="../node_modules/backbone-typings/backbone.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CategoryCount_1 = require("./Category/CategoryCount");
var Handlebars = require('handlebars');
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var CatPage = (function (_super) {
    __extends(CatPage, _super);
    function CatPage(expenses, categoryList) {
        var _this = this;
        _super.call(this);
        this.$el = $('#app');
        console.log('CatPage.constructor');
        this.collection = expenses;
        this.categoryList = categoryList;
        var importTag = $('#CatPage');
        var href = importTag.prop('href');
        console.log(importTag, href);
        $.get(href).then(function (result) {
            //console.log(result);
            _this.setTemplate(
            //_.template( result )
            Handlebars.compile(result));
        });
        //console.log(this);
        this.listenTo(this.categoryList, 'change', this.render);
        this.listenTo(this.categoryList, 'add', this.render);
        this.listenTo(this.categoryList, 'update', this.render);
    }
    CatPage.prototype.setTemplate = function (html) {
        this.template = html;
        this.render();
    };
    CatPage.prototype.render = function () {
        if (window.location.hash != '#CatPage')
            return;
        console.log('CatPage.render');
        if (this.template) {
            var categoryOptions_1 = [];
            this.categoryList.each(function (category) {
                //console.log(category);
                categoryOptions_1.push({
                    catName: category.get('catName'),
                    background: category.get('color'),
                    id: category.cid,
                    used: category.get('count'),
                    amount: category.getAmount()
                });
            });
            this.$el.html(this.template({
                categoryOptions: categoryOptions_1
            }));
            this.$('#addCategoryForm').on('submit', this.addCategory.bind(this));
            this.$('input[name="newName"]').focus();
            this.$el.on('change', 'input[type="color"]', this.selectColor.bind(this));
            this.$('button.close').on('click', this.deleteCategory.bind(this));
            this.$('#categoryCount').html(this.categoryList.size());
        }
        else {
            this.$el.html('Loading...');
        }
        return this;
    };
    CatPage.prototype.addCategory = function (event) {
        event.preventDefault();
        var $form = $(event.target);
        var newName = $form.find('input').val();
        console.log('newName', newName);
        var categoryObject = new CategoryCount_1["default"]({
            catName: newName
        });
        console.log('get', categoryObject.get('catName'));
        console.log('get', categoryObject.get('color'));
        this.categoryList.add(categoryObject);
    };
    CatPage.prototype.selectColor = function (event) {
        console.log(event);
        var $input = $(event.target);
        var id = $input.closest('tr').attr('data-id');
        console.log('id', id);
        var category = this.categoryList.get(id);
        console.log('category by id', category);
        if (category) {
            //console.log('color', event.target.value);
            category.set('color', event.target.value);
        }
    };
    CatPage.prototype.deleteCategory = function (event) {
        var button = event.target;
        var tr = $(button).closest('tr');
        var id = tr.attr('data-id');
        console.log(id);
        this.categoryList.remove(id);
    };
    return CatPage;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = CatPage;
//# sourceMappingURL=CatPage.js.map