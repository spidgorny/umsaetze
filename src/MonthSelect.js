///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
///<reference path="../typings/index.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Backbone = require('backbone');
var MonthSelect = (function (_super) {
    __extends(MonthSelect, _super);
    function MonthSelect() {
        _super.call(this);
        this.$el = $('#MonthSelect');
        this.yearSelect = this.$('select');
        this.monthOptions = this.$('button');
        console.log(this.yearSelect);
        console.log(this.monthOptions);
    }
    MonthSelect.prototype.render = function () {
        this.monthOptions.each(function (i, button) {
            //console.log(button);
            $(button)
                .removeAttr('disabled')
                .addClass('btn-danger')
                .removeClass('btn-default');
        });
        return this;
    };
    MonthSelect.prototype.show = function () {
        this.$el.show();
    };
    MonthSelect.prototype.hide = function () {
        this.$el.hide();
    };
    return MonthSelect;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = MonthSelect;
//# sourceMappingURL=MonthSelect.js.map