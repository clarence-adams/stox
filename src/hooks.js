import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';

export async function handle({ event, resolve }) {
	// redirect users with no valid token to the landing page
	if (
		event.url.pathname.startsWith('/dashboard') ||
		event.url.pathname.startsWith('/api/dashboard')
	) {
		const cookies = cookie.parse(event.request.headers.get('Cookie') || '');
		const authToken = cookies.authToken;

		console.log('cookies', cookies);
		console.log('authToken', authToken);

		if (authToken === undefined) {
			return new Response('Redirect', {
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
	// console.log(response);
	return response;
}
