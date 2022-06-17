export default async () => {
	// fetch user data from database and return up to date data
	const res = await fetch('/dashboard/api/get-user');
	let user;
	if (res.ok) {
		user = await res.json();
		return user;
	}
	return { name: 'user', cash: 0, portfolio: [] };
};
