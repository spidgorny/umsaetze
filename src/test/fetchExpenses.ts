import {FetchExpenses} from "../Sync/FetchExpenses";

const path = require('path');
let configPath = path.resolve(__dirname, '../../.env');
// console.log(configPath);
require('dotenv').config({
	path: configPath,
});
// console.dir(process.env);
const fs = require('fs');

async function login() {
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

async function testFinApi(fe) {
	let UserUsername = process.env['UserUsername'];
	let UserPassword = process.env['UserPassword'];
	let UserBLZ = process.env['UserBLZ'];
	let UserKonto = process.env['UserKonto'];
	let UserPIN = process.env['UserPIN'];
	return await fe.fetch(UserUsername, UserPassword, UserBLZ, UserKonto, UserPIN);
}

(async () => {
	try {
		const fe = new FetchExpenses(process.env['ClientID'], process.env['Secret']);
		// await fe.testPets();
		// await login();
		await testFinApi(fe);
	} catch (e) {
		console.error(e);
	}
})();
