"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const FetchExpenses_1 = require("./Sync/FetchExpenses");
require('dotenv').config();
const express = require('express');
var cors = require('cors');
const app = express();
const log = require('ololog');
app.use(cors());
app.get('/', (req, res) => res.send('Hello World!'));
app.get('/fetchTransactions', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const fs = new FetchExpenses_1.FetchExpenses(process.env['ClientID'], process.env['Secret']);
        const transactions = fs.fetch(req.query.email, req.query.password, req.query.blz, req.query.konto, req.query.pin);
        res.json({
            status: 'ok',
            data: transactions
        });
    }
    catch (e) {
        log.error(e);
        res.status(500).json({
            status: 'error',
            error: e,
        });
    }
}));
app.get('/test', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const fs = new FetchExpenses_1.FetchExpenses(process.env['ClientID'], process.env['Secret']);
        const transactions = yield fs.fetch(process.env['UserUsername'], process.env['UserPassword'], process.env['UserBLZ'], process.env['UserKonto'], process.env['UserPIN']);
        res.json({
            status: 'ok',
            data: transactions
        });
    }
    catch (e) {
        log.error(e);
        res.status(500).json({
            status: 'error',
            error: e,
        });
    }
}));
app.listen(3000, () => console.log('Example app listening on port 3000!'));
//# sourceMappingURL=server.js.map