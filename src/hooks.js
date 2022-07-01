// import * as cookie from 'cookie';
// import jwt from 'jsonwebtoken';

export async function handle({ event, resolve }) {
	// redirect users with no valid token to the landing page
	// if (
	// 	event.url.pathname.startsWith('/dashboard') ||
	// 	event.url.pathname.startsWith('/api/dashboard')
	// ) {
	// 	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	// 	const authToken = cookies.authToken;

	// 	if (authToken === undefined) {
	// 		return Response.redirect(baseUrl + '/login', 303);
	// 	}

	// 	try {
	// 		jwt.verify(authToken, import.meta.env.VITE_ACCESS_TOKEN_SECRET);
	// 	} catch (err) {
	// 		return Response.redirect(baseUrl + '/login', 303);
	// 	}
	// }

	const response = await resolve(event);
	// console.log(response);
	return response;
}
