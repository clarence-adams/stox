import db from '$lib/db.js';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';

export const get = async ({ request }) => {
	const cookies = cookie.parse(request.headers.get('cookie') || '');
	const authToken = cookies.authToken;

	// if there is no authToken in cookie
	if (authToken === undefined) {
		return {};
	}

	// get user_id from jwt stored in cookie
	let userId;
	try {
		userId = jwt.verify(authToken, import.meta.env.VITE_ACCESS_TOKEN_SECRET).id;
	} catch (err) {
		return {};
	}

	// query user info from database
	let query = 'SELECT username, cash FROM users WHERE user_id = $1';
	let rows;

	try {
		({ rows } = await db.query(query, [userId]));
	} catch (err) {
		console.log(err);
		return { status: 500 };
	}

	// if user is not found, return
	if (rows[0] === undefined) {
		return { status: 500, body: { success: false } };
	}

	// update user with up to date data
	const user = rows[0];

	// query user portfolio from database
	query = 'SELECT shares, average_cost, symbol FROM positions WHERE user_id = $1';
	rows = undefined;

	try {
		({ rows } = await db.query(query, [userId]));
	} catch (err) {
		console.log(err);
		return { status: 500 };
	}

	// if portfolio is not found, return
	if (rows[0] === undefined) {
		return { status: 500, body: { success: false } };
	}

	const portfolio = rows;
	user.portfolio = portfolio;

	return { status: 200, body: user };
};
