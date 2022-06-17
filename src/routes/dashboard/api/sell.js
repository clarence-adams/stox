import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import fetchQuote from '$lib/dashboard/fetchQuote.js';
import db from '$lib/db.js';

export const post = async ({ request }) => {
	const body = await request.formData();
	const symbol = body.get('symbol').toLowerCase();
	const shares = +body.get('shares');

	if (typeof shares !== 'number' || shares < 1) {
		return {
			status: 400,
			body: { transactionStatus: 'You must enter an amount of shares to purchase.' }
		};
	}

	// fetch quote, verify that no errors occurred, and calculate order total
	const quote = await fetchQuote(symbol);
	if (typeof quote !== 'number') {
		return {
			status: 400,
			body: { transactionStatus: quote }
		};
	}
	const orderTotal = quote * shares;

	// get user from the jwt cookie
	const cookies = cookie.parse(request.headers.get('cookie') || '');
	const authToken = cookies.authToken;

	let user;
	try {
		user = jwt.verify(authToken, import.meta.env.VITE_ACCESS_TOKEN_SECRET);
	} catch (err) {
		return { status: 500 };
	}

	// query user info from database
	let query = `
		SELECT cash 
		FROM users 
		WHERE user_id = $1
	`;

	let rows;
	try {
		({ rows } = await db.query(query, [user.id]));
	} catch (err) {
		console.log(err);
		return { status: 500 };
	}

	// if user is not found, return
	if (rows[0] === undefined) {
		return { status: 500 };
	}

	// converts user's cash into a number
	const cash = +rows[0].cash;

	// query database to see if user already has a position in this stock
	query = `
		SELECT * 
		FROM positions 
		WHERE user_id = $1 
		AND symbol = $2
	`;

	try {
		({ rows } = await db.query(query, [user.id, symbol]));
	} catch (err) {
		console.log(err);
		return { status: 500 };
	}

	const position = rows[0];

	if (position === undefined) {
		return {
			status: 400,
			body: { transactionStatus: 'You do not have a position in this stock!' }
		};
	}

	// ensure user has enough shares to sell
	position.shares = +position.shares;
	if (position.shares < shares) {
		return { status: 400, body: { transactionStatus: 'You do not own enough shares to sell!' } };
	}

	// update existing position
	if (position.shares === shares) {
		query = `
			DELETE FROM positions 
			WHERE user_id = $1 
			AND symbol = $2
		`;
		try {
			await db.query(query, [user.id, symbol]);
		} catch (err) {
			console.log(err);
			return { status: 500 };
		}
	} else {
		const newShareCount = position.shares - shares;
		query = `
			UPDATE positions 
			SET shares = $1 
			WHERE user_id = $2 
			AND symbol = $3
		`;
		try {
			await db.query(query, [newShareCount, user.id, symbol]);
		} catch (err) {
			console.log(err);
			return { status: 500 };
		}
	}

	// insert sale into sales table
	query = `
			INSERT INTO sales
			VALUES ($1, $2, $3, $4, $5)
		`;
	try {
		await db.query(query, [user.id, symbol, shares, quote, new Date()]);
	} catch (err) {
		console.log(err);
		return { status: 500 };
	}

	// update user's cash
	const newCash = cash + orderTotal;
	query = `
		UPDATE users 
		SET cash = $1 
		WHERE user_id = $2
	`;

	try {
		await db.query(query, [newCash, user.id]);
	} catch (err) {
		console.log(err);
		return { status: 500 };
	}

	return {
		status: 200,
		body: {
			transactionStatus: { shares: shares, symbol: symbol, orderTotal: orderTotal }
		}
	};
};
