import db from '$lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const patch = async ({ request }) => {
	const body = await request.json();

	for (const value of Object.entries(body)) {
		if (value[1] === null || value[1] === '') {
			return { status: 500 };
		}
	}

	const username = body.username;
	const password = body.password;
	const securityAnswer = body.securityAnswer.toLowerCase();

	// query user info from database
	const loginQuery = `
		SELECT user_id, username, security_answer
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
		return { status: 500 };
	}

	const user = rows[0];

	// authenticate security answer
	const authenticated = await bcrypt.compare(securityAnswer, user.security_answer);
	if (!authenticated) {
		return { status: 500 };
	}

	// hash password and security answer
	const bcryptRounds = 8;
	const hashedPassword = await bcrypt.hash(password, bcryptRounds);

	// execute registration query
	const resetPasswordQuery = `
	  UPDATE users SET password = $1 WHERE user_id = $2
	`;

	try {
		await db.query(resetPasswordQuery, [hashedPassword, user.user_id]);
	} catch (err) {
		console.log('there has been an error');
		return { status: 500 };
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
