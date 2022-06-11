import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';

export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/dashboard')) {
		const cookies = cookie.parse(event.request.headers.get('cookie') || '');
		const authToken = cookies.authToken;

		if (authToken === undefined) {
			return new Response({
				status: 303,
				headers: { Location: '/' }
			});
		}

		try {
			jwt.verify(authToken, import.meta.env.VITE_ACCESS_TOKEN_SECRET);
		} catch (err) {
			return new Response('Redirect', {
				status: 303,
				headers: { Location: '/' }
			});
		}
	}

	const response = await resolve(event);
	return response;
}

export function getSession(event) {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	const authToken = cookies.authToken;

	// if there is no authToken in cookie
	if (authToken === undefined) {
		return {};
	}

	let user;
	try {
		user = jwt.verify(authToken, import.meta.env.VITE_ACCESS_TOKEN_SECRET);
	} catch (err) {
		return {};
	}

	return { user: { id: user.id, name: user.name, cash: user.cash } };
}
