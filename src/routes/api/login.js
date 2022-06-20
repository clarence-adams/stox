import db from '$lib/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const post = async ({ request }) => {
	const body = await request.formData();
	const username = body.get('username');
	const password = body.get('password');

	// TODO: verify body

	// query user info from database
	const query = `
		SELECT user_id, username, password 
		FROM users WHERE username = $1
	`;
	let rows;

	try {
		({ rows } = await db.query(query, [username]));
	} catch (err) {
		console.log(err);
		return { status: 500 };
	}

	// if user is not found, return
	if (rows[0] === undefined) {
		return { status: 200, body: { success: false } };
	}

	// if user is found, authenticate
	const user = rows[0];
	const authenticated = await bcrypt.compare(password, user.password);

	if (!authenticated) {
		return { status: 200, body: { success: false } };
	}

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
		}
	};
};
