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
        this.selectedYear = 2014;
        this.selectedMonth = 'Feb';
        this.earliest = new Date('2014-08-01');
        this.latest = new Date('2016-05-15');
        this.yearSelect = this.$('select');
        this.monthOptions = this.$('button');
        console.log(this.yearSelect);
        console.log(this.monthOptions);
    }
    MonthSelect.prototype.render = function () {
        var _this = this;
        this.monthOptions.each(function (i, button) {
            //console.log(button);
            var firstOfMonth = new Date(_this.selectedYear + '-' + _this.selectedMonth + '-01');
            console.log(firstOfMonth);
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