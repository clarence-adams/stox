import db from '$lib/db.js';
import bcrypt from 'bcryptjs';

export const get = async ({ request }) => {
	const params = new URL(request.url).searchParams;
	const username = params.get('username');
	const answer = params.get('answer').toLowerCase();

	// query user info and portfolio from database
	let query = `
		SELECT security_answer
		FROM users
		WHERE username = $1
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
		return { status: 500 };
	}

	const securityAnswer = rows[0].security_answer;
	const authenticated = await bcrypt.compare(answer, securityAnswer);
	return { status: 200, body: { authenticated: authenticated } };
};
