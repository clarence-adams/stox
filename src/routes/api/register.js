import db from '$lib/db.js';

export const post = async ({ request }) => {
	const body = await request.formData();
	const username = body.get('username');
	const password = body.get('password');
	const passwordConfirmation = body.get('password-confirmation');

	// TODO: validate body

	// delete all users from users for testing
	db.query('DELETE FROM users', [], (err, res) => {
		if (err) {
			return console.log(err);
		}
	});

	// execute actual query
	const query = 'INSERT INTO users (cash, username, password) VALUES (10000, $1, $2)';

	db.query(query, [username, password], (err, res) => {
		if (err) {
			console.log(err);
			// TODO: Error handling
			return { status: 500 };
		}
		console.log(res);
	});

	return { status: 303, headers: { Location: '/dashboard' }, body: { success: true } };
};
