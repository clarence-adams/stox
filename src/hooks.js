import * as cookie from 'cookie';
import authenticate from '$lib/authenticate.js';

export async function handle({ event, resolve }) {
	// redirect users with no valid token to the landing page
	if (
		event.url.pathname.startsWith('/dashboard') ||
		event.url.pathname.startsWith('/api/dashboard')
	) {
		const cookies = cookie.parse(event.request.headers.get('cookie') || '');
		const authToken = cookies.authToken;

		const user = authenticate(authToken);

		if (user === null) {
			return new Response('Redirect', {
				status: 303,
				headers: { Location: '/' }
			});
		}
		event.locals.user = user;
	}
	const response = await resolve(event);
	console.log(response);
	return response;
}
