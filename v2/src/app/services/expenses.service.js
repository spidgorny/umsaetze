"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ExpensesService = /** @class */ (function () {
    function ExpensesService(loader, saver) {
        this.loader = loader;
        this.saver = saver;
        console.log('ExpensesService', this.loader.data.length);
        // this.saver.expenses = this.loader.expenses;
    }
    Object.defineProperty(ExpensesService.prototype, "data", {
        get: function () {
            //console.log('loader expenses', this.loader.expenses.length);
            return this.loader.data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExpensesService.prototype, "size", {
        /**
         *
         * @returns {number}
         */
        get: function () {
            return this.loader.data.length;
        },
        enumerable: true,
        configurable: true
    });
    ExpensesService.prototype.getEarliest = function () {
        if (!this.size) {
            return new Date();
        }
        var min = new Date().addYears(10).valueOf();
        this.data.forEach(function (row) {
            var dDate = row.getDate();
            var date = dDate.valueOf();
            if (date < min) {
                min = date;
            }
        });
        return new Date(min);
    };
    ExpensesService.prototype.getLatest = function () {
        if (!this.size) {
            return new Date();
        }
        var min = new Date('1970-01-01').valueOf();
        this.data.forEach(function (row) {
            var date = row.getDate().valueOf();
            if (date > min) {
                min = date;
            }
        });
        return new Date(min);
    };
    ExpensesService.prototype.save = function (tr) {
        this.saver.save(tr);
    };
    ExpensesService.prototype.filterByMonth = function (value) {
        return this.data.filter(function (tr) {
            return tr.isMonth(value);
        });
    };
    ExpensesService = __decorate([
        core_1.Injectable()
    ], ExpensesService);
    return ExpensesService;
}());
exports.ExpensesService = ExpensesService;
//# sourceMappingURL=expenses.service.js.map