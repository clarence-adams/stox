import db from '$lib/db.js';
import jwt from 'jsonwebtoken';

export const post = async ({ request }) => {
	const body = await request.formData();
	const username = body.get('username');
	const password = body.get('password');

	// TODO: verify body

	// query user info from database
	const query = 'SELECT user_id, username, password FROM users WHERE username = $1';
	let rows;

	try {
		({ rows } = await db.query(query, [username]));
	} catch (err) {
		console.log('there has been an error');
		return { status: 500 };
	}

	console.log(rows);

	// if user is not found, return
	if (rows[0] === undefined) {
		console.log('user not found');
		return { status: 200, body: { success: false } };
	}

	// if user is found, authenticate
	const user = rows[0];

	if (password !== user.password) {
		console.log('incorrect password');
		return { status: 200, body: { success: false } };
	}

	// if user is authenticated, redirect to the users dashboard
	console.log(user);

	// TODO give user an auth jwt
	return { status: 303, headers: { Location: '/dashboard' } };
};
