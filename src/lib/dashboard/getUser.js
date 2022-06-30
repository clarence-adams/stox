export default async () => {
	// fetch user data from database and return up to date data
	const res = await fetch('/api/dashboard/get-user');
	let user;
	if (res.ok) {
		user = await res.json();
		return user;
	} else {
		return { status: res.status };
	}
	return { name: 'user', cash: 0, portfolio: [] };
};
