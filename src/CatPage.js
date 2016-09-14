"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CategoryCount_1 = require("./CategoryCount");
var Handlebars = require('handlebars');
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
        var _this = this;
        if (window.location.hash != '#CatPage')
            return;
        console.log('CatPage.render');
        if (this.template) {
            var categoryOptions_1 = [];
            _.each(this.categoryList.allOptions, function (value, index) {
                categoryOptions_1.push({
                    catName: value,
                    background: _this.categoryList.colors[index]
                });
            });
            this.$el.html(this.template({
                categoryOptions: categoryOptions_1
            }));
            this.$('#addCategoryForm').on('submit', this.addCategory.bind(this));
            this.$('input').focus();
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
        this.categoryList.add(new CategoryCount_1["default"]({
            catName: newName
        }));
    };
    return CatPage;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = CatPage;
//# sourceMappingURL=CatPage.js.map