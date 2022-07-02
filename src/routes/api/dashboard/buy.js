import fetchQuote from '$lib/dashboard/fetchQuote';
import db from '$lib/db';

export const patch = async (event) => {
	const user = event.locals.user;
	if (!user) {
		return {
			status: 401
		};
	}

	const body = await event.request.formData();
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

	// converts user's cash to a number
	const cash = +rows[0].cash;

	if (orderTotal > cash) {
		return {
			status: 400,
			body: { transactionStatus: 'Not enough cash.' }
		};
	}

	// update user's cash
	const newCash = cash - orderTotal;
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
		// insert new position into positions table
		query = `
			INSERT INTO positions 
			VALUES ($1, $2, $3, $4)
		`;
		try {
			await db.query(query, [user.id, symbol, quote, shares]);
		} catch (err) {
			console.log(err);
			return { status: 500 };
		}
	} else {
		// update existing position in positions table
		position.shares = +position.shares;
		position.average_cost = +position.average_cost;
		const newShareCount = position.shares + shares;
		const newAverageCost =
			(position.shares * position.average_cost + shares * quote) / newShareCount;
		query = `
			UPDATE positions 
			SET shares = $1, average_cost = $2 
			WHERE user_id = $3 
			AND symbol = $4
		`;
		try {
			await db.query(query, [newShareCount, newAverageCost, user.id, symbol]);
		} catch (err) {
			console.log(err);
			return { status: 500 };
		}
	}

	// insert purchase into purchases table
	query = `
			INSERT INTO purchases 
			VALUES ($1, $2, $3, $4, $5)
		`;
	try {
		await db.query(query, [user.id, symbol, shares, quote, new Date()]);
	} catch (err) {
		console.log(err);
		return { status: 500 };
	}

	return {
		status: 200,
		body: {
			transactionStatus: { shares: shares, symbol: symbol, orderTotal: orderTotal.toLocaleString() }
		}
	};
};
