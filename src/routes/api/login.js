import db from '$lib/db.js';

export const post = async ({ request }) => {
	const body = await request.formData();

	// TODO: verify body

	const query = 'SELECT * FROM users';

	// db.query(query, [], (err, res) => {
	// 	if (err) {
	// 		// TODO: Error handling
	// 		return console.log(err);
	// 	}
	// 	console.log(res.rows);
	// 	response = { status: 500 };
	// });

	return { status: 303, headers: { Location: '/dashboard' } };
};
