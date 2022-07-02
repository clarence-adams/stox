import fetchQuote from '$lib/dashboard/fetchQuote';

export const get = async (event) => {
	const user = event.locals.user;
	if (!user) {
		return {
			status: 401
		};
	}

	const params = new URL(event.request.url).searchParams;
	const symbol = params.get('symbol').toLowerCase();
	const quote = await fetchQuote(symbol);

	return {
		status: 200,
		body: { quote: quote }
	};
};
