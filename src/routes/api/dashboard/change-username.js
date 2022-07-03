import db from '$lib/db';
import jwt from 'jsonwebtoken';

export const patch = async (event) => {
	const body = await event.request.formData();

	// verify all forms are filled out
	for (const value of body.values()) {
		if (value === '' || value === undefined) {
			return { status: 500 };
		}
	}

	const username = body.get('username');

	// query username
	let query = `
		SELECT username
		FROM users
		WHERE username ILIKE $1
	`;
	let rows;

	try {
		({ rows } = await db.query(query, [username]));
	} catch (err) {
		console.log(err);
		return { status: 500 };
	}

	// if user is not found, return
	if (rows[0] !== undefined) {
		if (rows[0].username.toLowerCase() !== username.toLowerCase()) {
			return { status: 400 };
		} else if (rows[0].username === username) {
			return { status: 418 };
		}
	}

	// execute changeUsername query
	const changeUsernameQuery = `
    UPDATE users 
    SET username = $1 WHERE 
    user_id = $2;
	`;

	try {
		await db.query(changeUsernameQuery, [username, event.locals.user.id]);
	} catch (err) {
		console.log('there has been an error changing usernames');
		return { status: 500 };
	}

	// query new user info from database
	const loginQuery = `
		SELECT user_id, username 
		FROM users WHERE username = $1
	`;

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
		status: 200,
		headers: {
			'Set-Cookie': `authToken=${authToken}; SameSite=None; Path=/; HttpOnly; Secure`,
			Location: '/dashboard'
		}
	};
};
