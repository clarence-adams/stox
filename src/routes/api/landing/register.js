import db from '$lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const post = async ({ request }) => {
	const body = await request.formData();

	// verify all forms are filled out
	for (const value of body.values()) {
		if (value === '' || value === undefined) {
			return { status: 500 };
		}
	}

	const username = body.get('username');
	const password = body.get('password');
	const securityQuestion = body.get('security-question');
	const securityAnswer = body.get('security-answer').toLowerCase();

	// hash password and security answer
	const bcryptRounds = 8;
	const hashedPassword = await bcrypt.hash(password, bcryptRounds);
	const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, bcryptRounds);

	// execute registration query
	const registrationQuery = `
		INSERT INTO users (cash, username, password, security_question, security_answer) 
		VALUES (10000, $1, $2, $3, $4)
	`;

	try {
		await db.query(registrationQuery, [
			username,
			hashedPassword,
			securityQuestion,
			hashedSecurityAnswer
		]);
	} catch (err) {
		console.log('there has been an error');
		return { status: 500 };
	}

	// query new user info from database
	const loginQuery = `
		SELECT user_id, username, password 
		FROM users WHERE username = $1
	`;
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
			'Set-Cookie': `authToken=${authToken}; SameSite=None; Path=/; HttpOnly; Secure`,
			Location: '/dashboard'
		},
		body: { success: true }
	};
};
