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
const Swagger = require('swagger-client');
const log = require('ololog');
class FetchExpenses {
    constructor(clientID, clientSecret) {
        this.clientID = clientID;
        this.clientSecret = clientSecret;
    }
    initPets() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client = yield Swagger('http://petstore.swagger.io/v2/swagger.json');
        });
    }
    testPets() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initPets();
            this.client.apis.pet.addPet({ id: 1, name: "bobby" })
                .then(ok => {
                console.log(ok);
            });
            this.client.execute({
                operationId: 'addPet', parameters: {
                    id: 1,
                    name: "bobby"
                }
            }).then(ok => {
                log.error(ok);
            });
        });
    }
    initFinApi() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client = yield Swagger({
                url: 'https://docs.finapi.io/js/swagger.json',
                requestInterceptor: (req) => {
                    if (this.token && 'access_token' in this.token) {
                        req.headers['Authorization'] = 'Bearer ' + this.token.access_token;
                    }
                    req.headers['Content-Type'] = 'application/json';
                    return req;
                }
            });
        });
    }
    fetch(UserUsername, UserPassword, UserBLZ, UserKonto, UserPIN) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initFinApi();
            log('Auth...', UserUsername, UserPassword);
            yield this.loginUser(UserUsername, UserPassword);
            log('Connection...');
            let connection = yield this.getConnection(UserBLZ);
            if (!connection) {
                log('Bank...', UserBLZ);
                const bank = yield this.findBank(UserBLZ);
                log('MakeConnection...');
                connection = yield this.makeConnection(bank, UserKonto, UserPIN);
            }
            log('Accounts...');
            let account = yield this.getAccounts(connection, UserKonto);
            log(account);
            let transactions = yield this.getTransactions(account);
            log(transactions.length);
            return transactions;
        });
    }
    findBank(blz) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.client.apis.Banks.getAndSearchAllBanks({
                search: blz,
            });
            if (results.body.banks.length == 1) {
                return results.body.banks[0];
            }
            else {
                throw new Error(results.body.banks.length + ' banks found. Should be one.');
            }
        });
    }
    loginUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.client.apis.Authorization.getToken({
                grant_type: 'password',
                client_id: this.clientID,
                client_secret: this.clientSecret,
                username,
                password,
            });
            this.token = token.body;
        });
    }
    getConnection(blz) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.client.apis['Bank Connections'].getAllBankConnections();
            for (let c of results.body.connections) {
                if (c.bank.blz == blz) {
                    return c;
                }
            }
            return null;
        });
    }
    makeConnection(bank, account, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.client.apis['Bank Connections'].importBankConnection({
                body: JSON.stringify({
                    bankId: bank.id,
                    bankingUserId: account,
                    bankingPin: password,
                })
            });
            log('makeConnection', results.body);
            return results.body;
        });
    }
    getAccounts(connection, account) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.client.apis.Accounts.getAndSearchAllAccounts({
                bankConnectionIds: [connection.id],
            });
            for (let c of results.body.accounts) {
                if (c.accountNumber == account) {
                    return c;
                }
            }
            return null;
        });
    }
    getTransactions(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = [];
            let results = yield this.client.apis.Transactions.getAndSearchAllTransactions({
                accountIds: [account.id],
                view: 'bankView',
            });
            collection.push(...results.body.transactions);
            log(results.body.paging);
            while (results.body.paging.page < results.body.paging.pageCount) {
                log('page', results.body.paging.page, 'of', results.body.paging.pageCount, collection.length);
                results = yield this.client.apis.Transactions.getAndSearchAllTransactions({
                    accountIds: [account.id],
                    view: 'bankView',
                    page: results.body.paging.page + 1,
                });
                collection.push(...results.body.transactions);
            }
            return collection;
        });
    }
}
exports.FetchExpenses = FetchExpenses;
//# sourceMappingURL=FetchExpenses.js.map