import db from '$lib/db';

export const get = async ({ request }) => {
	const params = new URL(request.url).searchParams;
	const username = params.get('username');

	// query user info and portfolio from database
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
		return { status: 200, body: { available: false } };
	}

	return { status: 200, body: { available: true } };
};
