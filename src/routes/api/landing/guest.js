import db from '$lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const get = async () => {
	// clear guest info
	const deleteQuery = `
    DELETE FROM users 
    WHERE username ILIKE 'guest'
	`;

	try {
		await db.query(deleteQuery);
	} catch (err) {
		console.log('there has been an error');
		console.log(err);
		return { status: 500 };
	}

	// execute registration query
	const registrationQuery = `
		INSERT INTO users (cash, username, password, security_question, security_answer) 
		VALUES (10000, $1, $2, $3, $4)
	`;

	// hash password and security answer
	const bcryptRounds = 1;
	const hashedPassword = await bcrypt.hash(crypto.randomUUID(), bcryptRounds);
	const hashedSecurityAnswer = await bcrypt.hash(crypto.randomUUID(), bcryptRounds);

	try {
		await db.query(registrationQuery, [
			'Guest',
			hashedPassword,
			"You're not supposed to be here!",
			hashedSecurityAnswer
		]);
	} catch (err) {
		console.log('there has been an error');
		return { status: 500 };
	}

	// query new user info from database
	const loginQuery = `
		SELECT user_id, username
		FROM users WHERE username = $1
	`;
	let rows;

	try {
		({ rows } = await db.query(loginQuery, ['Guest']));
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
			'Set-Cookie': `authToken=${authToken}; SameSite=None; Path=/; HttpOnly; Secure`,
			Location: '/dashboard'
		},
		body: { success: true }
	};
};
