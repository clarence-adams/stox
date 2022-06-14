export default async () => {
	// fetch user data from database and return up to date data
	const res = await fetch('/dashboard/api/getUser');
	let user;
	if (res.status === 200) {
		user = await res.json();
	}
	return user;
};
