import db from '$lib/db';

export const get = async (event) => {
	const user = event.locals.user;
	if (!user) {
		return {
			status: 401
		};
	}

	// query user info and portfolio from database
	let query = `
		SELECT username, cash, symbol, shares, average_cost 
		FROM users 
		LEFT OUTER JOIN positions 
		ON users.user_id = positions.user_id 
		WHERE users.user_id = $1
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
		return { status: 500, body: { success: false } };
	}
	const username = rows[0].username;
	const cash = rows[0].cash;

	// formats portfolio
	let portfolio;
	if (rows[0].shares === null) {
		portfolio = [];
	} else {
		portfolio = rows.map((e) => {
			if (e.symbol !== null && e.shares !== null && e.average_cost !== null) {
				return { symbol: e.symbol, shares: e.shares, averageCost: e.average_cost };
			}
		});
	}
	portfolio.sort((a, b) => b.shares - a.shares);

	// query users purchases
	query = `
		SELECT symbol, shares, price, datetime 
		FROM purchases
		WHERE user_id = $1
		ORDER BY datetime DESC
		LIMIT 10
	`;
	try {
		({ rows } = await db.query(query, [user.id]));
	} catch (err) {
		console.log(err);
		return { status: 500 };
	}
	const purchases = rows;

	// query users sales
	query = `
		SELECT symbol, shares, price, datetime 
		FROM sales
		WHERE user_id = $1
		ORDER BY datetime DESC
		LIMIT 10
	`;
	try {
		({ rows } = await db.query(query, [user.id]));
	} catch (err) {
		console.log(err);
		return { status: 500 };
	}
	const sales = rows;

	const userData = {
		name: username,
		cash: cash,
		portfolio: portfolio,
		purchases: purchases,
		sales: sales
	};

	return { status: 200, body: userData };
};
