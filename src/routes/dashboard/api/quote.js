import fetchQuote from '$lib/dashboard/fetchQuote.js';

export const post = async ({ request }) => {
	const body = await request.formData();
	const symbol = body.get('symbol').toLowerCase();
	const quote = await fetchQuote(symbol);

	return {
		status: 200,
		body: { quote: quote }
	};
};
