const path = require('path');
let configPath = path.resolve(__dirname, '../../.env');
// console.log(configPath);
require('dotenv').config({
	path: configPath,
});
// console.dir(process.env);
// import Swagger from 'swagger-client';
const Swagger = require('swagger-client');
const fs = require('fs');
const log = require('ololog');

class FetchExpenses {

	client: any/*Swagger*/;
	token: {
		access_token: string,
		token_type: string,
		expires_in: number,
		scope: string,
	};

	constructor() {
	}

	async initPets() {
		this.client = await Swagger('http://petstore.swagger.io/v2/swagger.json');
		// console.log(this.client.spec); // The resolved spec
		// console.log(this.client.originalSpec); // In case you need it
		// console.log(this.client.errors); // Any resolver errors
	}

	async testPets() {
		await this.initPets();
		// Tags interface
		this.client.apis.pet.addPet({id: 1, name: "bobby"})
			.then(ok => {
				console.log(ok);
			});

		// TryItOut Executor, with the `spec` already provided
		this.client.execute({
			operationId: 'addPet', parameters: {
				id: 1,
				name: "bobby"
			}
		}).then(ok => {
			log.error(ok);
		});
	}

	async initFinApi() {
		this.client = await Swagger({
			url: 'https://docs.finapi.io/js/swagger.json',
			requestInterceptor: (req) => {
				//console.log(this.token);
				if (this.token && 'access_token' in this.token) {
					req.headers['Authorization'] = 'Bearer ' + this.token.access_token;
				}
				req.headers['Content-Type'] = 'application/json';
				// log(req.headers);
				return req;
			}
		});
	}

	async testFinApi() {
		await this.initFinApi();
		// await this.login();
		let UserUsername = process.env['UserUsername'];
		let UserPassword = process.env['UserPassword'];
		log('Auth...', UserUsername, UserPassword);
		await this.loginUser(UserUsername, UserPassword);

		let UserBLZ = process.env['UserBLZ'];
		let UserKonto = process.env['UserKonto'];
		let UserPIN = process.env['UserPIN'];

		log('Connection...');
		let connection = await this.getConnection(UserBLZ);
		if (!connection) {
			log('Bank...', UserBLZ);
			const bank = await this.findBank(UserBLZ);
			log('MakeConnection...');
			connection = await this.makeConnection(bank, UserKonto, UserPIN);
		}

		log('Accounts...');
		let account = await this.getAccounts(connection, UserKonto);
		log(account);

		let transactions = await this.getTransactions(account);
		log(transactions.length);
	}

	async login() {
		const tokenFile = path.resolve(__dirname, 'token.json');
		if (fs.existsSync(tokenFile)) {
			const data = fs.readFileSync(tokenFile);
			this.token = JSON.parse(data);
		} else {
			if (!process.env['ClientID']) {
				throw new Error('Provide ClientID env');
			}
			if (!process.env['Secret']) {
				throw new Error('Provide Secret env');
			}
			// console.log(process.env['ClientID'], process.env['Secret']);
			const token = await this.client.apis.Authorization.getToken({
				grant_type: 'client_credentials',
				client_id: process.env['ClientID'],
				client_secret: process.env['Secret'],
			});
			// console.log(token);
			this.token = token.body;
			fs.writeFileSync(tokenFile, JSON.stringify(this.token));
		}
	}

	async findBank(blz) {
		const results = await this.client.apis.Banks.getAndSearchAllBanks({
			search: blz,
		});
		if (results.body.banks.length == 1) {
			return results.body.banks[0];
		} else {
			throw new Error(results.body.banks.length + ' banks found. Should be one.')
		}
	}

	async loginUser(username, password) {
		const token = await this.client.apis.Authorization.getToken({
			grant_type: 'password',
			client_id: process.env['ClientID'],
			client_secret: process.env['Secret'],
			username,
			password,
		});
		// console.log(token);
		this.token = token.body;
	}

	async getConnection(blz) {
		const results = await this.client.apis['Bank Connections'].getAllBankConnections();
		// log('connections', results.body.connections);
		for (let c of results.body.connections) {
			if (c.bank.blz == blz) {
				return c;
			}
		}
		return null;
	}

	async makeConnection(bank, account, password) {
		const results = await this.client.apis['Bank Connections'].importBankConnection({
			body: JSON.stringify({
				bankId: bank.id,
				bankingUserId: account,
				bankingPin: password,
			})
		});
		log('makeConnection', results.body);
		return results.body;
	}

	async getAccounts(connection, account) {
		const results = await this.client.apis.Accounts.getAndSearchAllAccounts({
			bankConnectionIds: [connection.id],
		});
		// log('connections', results.body.accounts);
		for (let c of results.body.accounts) {
			if (c.accountNumber == account) {
				return c;
			}
		}
		return null;
	}

	async getTransactions(account) {
		const collection = [];
		let results = await this.client.apis.Transactions.getAndSearchAllTransactions({
			accountIds: [account.id],
			view: 'bankView',
		});
		collection.push(...results.body.transactions);
		log(results.body.paging);
		while (results.body.paging.page < results.body.paging.pageCount) {
			log('page', results.body.paging.page, 'of', results.body.paging.pageCount, collection.length);
			results = await this.client.apis.Transactions.getAndSearchAllTransactions({
				accountIds: [account.id],
				view: 'bankView',
				page: results.body.paging.page + 1,
			});
			collection.push(...results.body.transactions);
		}
		// log(results);
		return collection;
	}

}

(async () => {
	try {
		const fe = new FetchExpenses();
		// await fe.testPets();
		await fe.testFinApi();
	} catch (e) {
		console.error(e);
	}
})();
