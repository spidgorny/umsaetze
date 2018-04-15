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
const FetchExpenses_1 = require("../Sync/FetchExpenses");
const path = require('path');
let configPath = path.resolve(__dirname, '../../.env');
require('dotenv').config({
    path: configPath,
});
const fs = require('fs');
function login() {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenFile = path.resolve(__dirname, 'token.json');
        if (fs.existsSync(tokenFile)) {
            const data = fs.readFileSync(tokenFile);
            this.token = JSON.parse(data);
        }
        else {
            if (!process.env['ClientID']) {
                throw new Error('Provide ClientID env');
            }
            if (!process.env['Secret']) {
                throw new Error('Provide Secret env');
            }
            const token = yield this.client.apis.Authorization.getToken({
                grant_type: 'client_credentials',
                client_id: process.env['ClientID'],
                client_secret: process.env['Secret'],
            });
            this.token = token.body;
            fs.writeFileSync(tokenFile, JSON.stringify(this.token));
        }
    });
}
function testFinApi(fe) {
    return __awaiter(this, void 0, void 0, function* () {
        let UserUsername = process.env['UserUsername'];
        let UserPassword = process.env['UserPassword'];
        let UserBLZ = process.env['UserBLZ'];
        let UserKonto = process.env['UserKonto'];
        let UserPIN = process.env['UserPIN'];
        return yield fe.fetch(UserUsername, UserPassword, UserBLZ, UserKonto, UserPIN);
    });
}
(() => __awaiter(this, void 0, void 0, function* () {
    try {
        const fe = new FetchExpenses_1.FetchExpenses(process.env['ClientID'], process.env['Secret']);
        yield testFinApi(fe);
    }
    catch (e) {
        console.error(e);
    }
}))();
//# sourceMappingURL=fetchExpenses.js.map