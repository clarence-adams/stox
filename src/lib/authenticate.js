import jwt from 'jsonwebtoken';

export default (authToken) => {
	if (authToken === undefined) {
		return null;
	}

	let user;
	try {
		user = jwt.verify(authToken, import.meta.env.VITE_ACCESS_TOKEN_SECRET);
	} catch (err) {
		return null;
	}

	return user;
};
