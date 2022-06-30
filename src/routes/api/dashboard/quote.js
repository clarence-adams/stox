import * as cookie from 'cookie';
import authenticate from '$lib/authenticate.js';
import fetchQuote from '$lib/dashboard/fetchQuote.js';

export const get = async ({ request }) => {
	// get user from the jwt cookie
	const cookies = cookie.parse(request.headers.get('cookie') || '');
	const authToken = cookies.authToken;
	const user = authenticate(authToken);

	if (user === null) {
		return {
			status: 401
		};
	}

	const params = new URL(request.url).searchParams;
	const symbol = params.get('symbol').toLowerCase();
	const quote = await fetchQuote(symbol);

	return {
		status: 200,
		body: { quote: quote }
	};
};
