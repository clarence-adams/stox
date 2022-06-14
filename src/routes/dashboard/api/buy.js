import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import fetchQuote from '$lib/dashboard/fetchQuote.js';
import db from '$lib/db.js';

export const post = async ({ request }) => {
	// get user from the jwt cookie
	const cookies = cookie.parse(request.headers.get('cookie') || '');
	const authToken = cookies.authToken;

	let user;
	try {
		user = jwt.verify(authToken, import.meta.env.VITE_ACCESS_TOKEN_SECRET);
	} catch (err) {
		return { status: 500 };
	}
	user.cash = +user.cash;

	const body = await request.formData();
	const symbol = body.get('symbol').toLowerCase();
	const shares = +body.get('shares');
	const quote = await fetchQuote(symbol);
	const orderTotal = quote * shares;

	// TODO buy logic here
	console.log(user);
	console.log(typeof quote);
	console.log(orderTotal);
	console.log(user.cash);

	if (orderTotal > user.cash) {
		return { status: 200, body: { transactionStatus: 'Not enough cash.' } };
	}

	// query database to see if user already has a position in this stock
	let query = 'SELECT * FROM positions WHERE user_id = $1 AND symbol = $2';

	let rows;
	try {
		({ rows } = await db.query(query, [user.id, symbol]));
	} catch (err) {
		console.log(err);
		return { status: 500 };
	}

	if (rows[0] === undefined) {
		// // insert new position into database
		// query = 'INSERT INTO positions VALUES ($1, $2, $3, $4);';
		// let rows;
		// try {
		// 	({ rows } = await db.query(query, [user.id, symbol, quote, shares]));
		// } catch (err) {
		// 	console.log(err);
		// 	return { status: 500 };
		// }
	} else {
		// // update existing position
		// query =
		//'UPDATE positions SET shares = $1 + $2 AND average_cost = $TODO WHERE user_id = user.id AND symbol = 'gme''
	}
	console.log(rows);

	const test = `symbol: ${symbol}, shares: ${shares}`;

	return {
		status: 200,
		body: { transactionStatus: test }
	};
};
