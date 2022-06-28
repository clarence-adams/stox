import fetchQuote from '$lib/dashboard/fetchQuote.js';

export const get = async ({ request }) => {
	const params = new URL(request.url).searchParams;
	const symbol = params.get('symbol').toLowerCase();
	const quote = await fetchQuote(symbol);

	return {
		status: 200,
		body: { quote: quote }
	};
};
