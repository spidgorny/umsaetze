"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Backbone = require("backbone");
const _ = __importStar(require("underscore"));
const axios_1 = __importDefault(require("axios"));
const log = require('ololog');
class FetchTransactions {
    constructor(expenses, tf) {
        this.email = 'e.m@i.l';
        this.password = '';
        this.blz = '123';
        this.konto = '123';
        this.pin = '123';
        this.template = `
<div class="panel panel-default">
	<div class="panel-heading">
		Fetch last transactions directly from your bank.
	</div>
	<div class="panel-body">
		<form id="FetchTransactionsForm">
			<div class="form-group">
				<label for="email">E-mail address</label>
				<input type="email" name="email" value="<%- email %>" required class="form-control"/>
			</div>
			<div class="form-group">
    			<label for="password">FinApi Password (leave blank to register)</label>
    			<input type="password" name="password" class="form-control"/>
			</div>
			<div class="form-group">
    			<label for="blz">Your bank BLZ</label>
    			<input type="text" name="blz" value="<%- blz %>" required class="form-control"/>
			</div>
			<div class="form-group">
    			<label for="konto">Your bank account number</label>
    			<input type="text" name="konto" value="<%- konto %>" required class="form-control"/>
			</div>
			<div class="form-group">
    			<label for="pin">Your online banking PIN code <span title="See FinApi.io for privacy policy">(i)</span></label>
    			<input type="password" name="pin" required class="form-control" value="<%- pin %>"/>
    			<!--<p class="help-block">PIN is only required during the registration.</p>-->
			</div>
			<input type="submit" value="Fetch Transactions" class="btn btn-default"/>
		</form>
	</div>
</div>
`;
        this.templateFunc = _.template(this.template);
        this.expenses = expenses;
        this.tf = tf;
        const defaultFields = window.localStorage.getItem('FetchTransactions');
        log(defaultFields);
        const values = JSON.parse(defaultFields);
        Object.assign(this, values);
    }
    setDiv(div) {
        this.div = div;
    }
    render() {
        log('FetchTransactions', this.div);
        this.email = 'something@else.com';
        this.div.html(this.templateFunc(this));
        this.form = this.div.find('#FetchTransactionsForm');
        this.form.on('submit', this.startFetch.bind(this));
    }
    startFetch(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const json = this.getFormValues(this.form);
            try {
                const url = 'http://localhost:3000/test';
                const response = yield axios_1.default.get(url, {
                    params: json,
                });
                console.log(response.data.data);
                for (let t of response.data.data) {
                    this.expenses.add(this.tf.make(Object.assign({ account: null, category: (t.category && 'name' in t.category) ? t.category.name : 'Default', currency: "EUR", amount: t.amount, payment_type: t.type, date: t.bankBookingDate, note: t.counterpartName }, t)));
                }
                Backbone.history.navigate('#', {
                    trigger: true,
                });
            }
            catch (e) {
                console.error(e);
            }
            return false;
        });
    }
    getFormValuesPure() {
        const form = this.form.get(0);
        const json = {};
        const data = new FormData(form);
    }
    getFormValues(form) {
        const config = {};
        this.form.serializeArray().map(function (item) {
            if (config[item.name]) {
                if (typeof (config[item.name]) === "string") {
                    config[item.name] = [config[item.name]];
                }
                config[item.name].push(item.value);
            }
            else {
                config[item.name] = item.value;
            }
        });
        return config;
    }
}
exports.FetchTransactions = FetchTransactions;
//# sourceMappingURL=FetchTransactions.js.map