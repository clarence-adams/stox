import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import db from '$lib/db.js';

export const get = async ({ request }) => {
	const cookies = cookie.parse(request.headers.get('cookie') || '');
	const authToken = cookies['authToken'];

	// if there is no authToken in cookie
	if (authToken === undefined) {
		return { status: 401 };
	}

	let userId;
	try {
		userId = jwt.verify(authToken, import.meta.env.VITE_ACCESS_TOKEN_SECRET);
	} catch (err) {
		console.log(err);
		return { status: 500 };
	}
	// query user info from database
	const query = 'SELECT username, cash FROM users WHERE user_id = $1';
	let rows;

	try {
		({ rows } = await db.query(query, [userId]));
	} catch (err) {
		console.log('there has been an error');
		console.log(err);
		return { status: 500 };
	}

	const user = rows[0];
	return { status: 200, body: { user: user } };
};
