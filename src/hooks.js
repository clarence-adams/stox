import { prerendering } from '$app/env';
import * as cookie from 'cookie';
import authenticate from '$lib/authenticate.js';

export const handle = async ({ event, resolve }) => {
	// prevents SvelteKit from prerendering the following redirect during build
	if (prerendering) return await resolve(event);
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
				headers: { Location: '/', 'Set-Cookie': `test=${user}; SameSite=none; secure;` }
			});
		}
		event.locals.user = user;
	}

	return await resolve(event);
};
