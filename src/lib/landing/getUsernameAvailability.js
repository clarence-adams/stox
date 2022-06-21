export default async (username) => {
	// fetch user data from database and return up to date data
	const res = await fetch('/api/get-username-availability', {
		method: 'POST',
		body: username
	});
	let available;
	if (res.ok) {
		const data = await res.json();
		return data.available;
	}
	return 'error';
};
