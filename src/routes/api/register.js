import db from '$lib/db.js';

export const post = async ({ request }) => {
	const body = await request.formData();
	const username = body.get('username');
	const password = body.get('password');
	const passwordConfirmation = body.get('password-confirmation');

	// TODO: validate body

	// delete all users from users for testing
	await db.query('DELETE FROM users', []);

	// execute actual query
	const query = 'INSERT INTO users (cash, username, password) VALUES (10000, $1, $2)';
	let response;

	try {
		response = await db.query(query, [username, password]);
	} catch (err) {
		console.log('there has been an error');
		return { status: 500 };
	}

	console.log(response);

	return { status: 303, headers: { Location: '/dashboard' }, body: { success: true } };
};
