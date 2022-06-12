export const post = async ({ request }) => {
	const body = await request.formData();
	const symbol = body.get('symbol').toLowerCase();
	console.log(symbol);

	// fetch stock info
	let quote;
	try {
		quote = await fetch(
			`https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${
				import.meta.env.VITE_IEX_API_TOKEN
			}`
		)
			.then((res) => res.json())
			.then((res) => (quote = res.latestPrice));
	} catch (err) {
		console.log(err);
		return {
			status: 500
		};
	}

	if (quote === undefined) {
		return {
			status: 200,
			body: { quote: 'invalid symbol' }
		};
	} else if (quote === null || quote === 0) {
		// handles api bug that happens from time to time
		return {
			statusCode: 200,
			body: { error: 'average is null' }
		};
	} else {
		return {
			status: 200,
			body: { quote: quote }
		};
	}
};
