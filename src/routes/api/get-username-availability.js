import db from '$lib/db.js';

export const post = async ({ request }) => {
	const username = await request.text();

	// query user info and portfolio from database
	let query = `
		SELECT username
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
	if (rows[0] !== undefined) {
		return { status: 200, body: { available: false } };
	}

	return { status: 200, body: { available: true } };
};
