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
import Backbone from 'backbone-es6/src/Backbone.js';
import md5 from 'md5';
var Transaction = (function (_super) {
    __extends(Transaction, _super);
    function Transaction(attributes, options) {
        var _this = _super.call(this, attributes, options) || this;
        _this.defaults = {
            visible: true,
        };
        var dDate;
        var sDate = _this.get('date');
        if (sDate instanceof Date) {
            dDate = sDate.clone();
            sDate = dDate.toString('d.M.yyyy');
        }
        else {
            dDate = new Date(sDate);
            var dDateValid = !isNaN(dDate.getTime());
            if (!dDate || !dDateValid) {
                dDate = Date.parseExact(sDate, "d.M.yyyy");
            }
            _this.set('date', dDate);
        }
        if (!_this.get('id')) {
            _this.set('id', md5(sDate + _this.get('amount')));
        }
        _this.set('amount', parseFloat(_this.get('amount')));
        if (!_this.has('visible')) {
            _this.set('visible', true);
        }
        _this.set('category', _this.get('category') || 'Default');
        _this.set('note', _this.get('note'));
        _this.set('done', _this.get('done'));
        return _this;
    }
    Transaction.prototype.sign = function () {
        return this.get('amount') >= 0 ? 'positive' : 'negative';
    };
    Transaction.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.sign = this.sign();
        json.id = this.id;
        return json;
    };
    Transaction.prototype.setCategory = function (category) {
        this.set('category', category);
        this.collection.localStorage.update(this);
    };
    Transaction.prototype.getDate = function () {
        var date = this.get('date');
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return date;
    };
    Transaction.prototype.isVisible = function () {
        return this.get('visible');
    };
    Transaction.prototype.getAmount = function () {
        return this.get('amount');
    };
    return Transaction;
}(Backbone.Model));
export default Transaction;
//# sourceMappingURL=Transaction.js.map