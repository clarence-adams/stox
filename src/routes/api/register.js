import db from '$lib/db.js';
import jwt from 'jsonwebtoken';

export const post = async ({ request }) => {
	const body = await request.formData();
	const username = body.get('username');
	const password = body.get('password');

	// TODO: validate body

	// delete all users from users for testing
	await db.query('DELETE FROM users', []);

	// execute registration query
	const registrationQuery = 'INSERT INTO users (cash, username, password) VALUES (10000, $1, $2)';
	let response;

	try {
		response = await db.query(registrationQuery, [username, password]);
	} catch (err) {
		console.log('there has been an error');
		return { status: 500 };
	}

	console.log(response);
	// query new user info from database
	const loginQuery = 'SELECT user_id, username, password FROM users WHERE username = $1';
	let rows;

	try {
		({ rows } = await db.query(loginQuery, [username]));
	} catch (err) {
		console.log(err);
		return { status: 500 };
	}

	// if user is not found, return
	if (rows[0] === undefined) {
		console.log('user not found');
		return { status: 200, body: { success: false } };
	}

	// if user is found, authenticate
	const user = rows[0];

	// if user is authenticated, set an authToken cookie and redirect to the
	// users dashboard
	const authToken = jwt.sign(
		{ id: user.user_id, name: user.username },
		import.meta.env.VITE_ACCESS_TOKEN_SECRET
	);

	return {
		status: 303,
		headers: {
			'Set-Cookie': `authToken=${authToken}; SameSite=Strict; Path=/; HttpOnly`,
			Location: '/dashboard'
		},
		body: { success: true }
	};
};
