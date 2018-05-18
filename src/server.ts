import {FetchExpenses} from "./Sync/FetchExpenses";

require('dotenv').config();
const express = require('express');
var cors = require('cors');
const app = express();
const log = require('ololog');
const serveStatic = require('serve-static');

app.use(cors());
app.use(serveStatic('docs/web'));

app.get('/hello', (req, res) => res.send('Hello World!'));

app.get('/fetchTransactions', async (req, res) => {
	// log(req.body, req.params, req.query);

	try {
		const fs = new FetchExpenses(process.env['ClientID'], process.env['Secret']);
		const transactions = fs.fetch(req.query.email, req.query.password, req.query.blz, req.query.konto, req.query.pin);
		res.json({
			status: 'ok',
			data: transactions
		});
	} catch (e) {
		log.error(e);
		res.status(500).json({
			status: 'error',
			error: e,
		});
	}
});

app.get('/test', async (req, res) => {
	try {
		const fs = new FetchExpenses(process.env['ClientID'], process.env['Secret']);
		const transactions = await fs.fetch(
			process.env['UserUsername'], process.env['UserPassword'],
			process.env['UserBLZ'], process.env['UserKonto'], process.env['UserPIN']
		);
		res.json({
			status: 'ok',
			data: transactions
		});
	} catch (e) {
		log.error(e);
		res.status(500).json({
			status: 'error',
			error: e,
		});
	}
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
