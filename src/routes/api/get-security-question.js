import db from '$lib/db';

export const get = async ({ request }) => {
	const params = new URL(request.url).searchParams;
	const username = params.get('username');

	// query user info and portfolio from database
	let query = `
		SELECT security_question
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
		return { status: 400 };
	}

	const securityQuestion = rows[0].security_question;

	return { status: 200, body: { securityQuestion: securityQuestion } };
};
