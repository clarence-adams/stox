export const get = () => {
	return {
		status: 303,
		headers: {
			'Set-Cookie': 'authToken=loggedOut; SameSite=Strict; Path=/; HttpOnly',
			Location: '/'
		}
	};
};
