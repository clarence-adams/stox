export default async (symbol) => {
	// if there is no symbol do not waste a call to the IEX API
	if (symbol === '' || undefined) return 'No symbol was input.';

	// fetch stock info
	let res = await fetch(
		`https://cloud.iexapis.com/stable/stock/${symbol.toLowerCase()}/quote?token=${
			import.meta.env.VITE_IEX_API_TOKEN
		}`
	);

	switch (res.status) {
		case 200:
			const quote = await res.json();
			return quote.latestPrice;
		case 404:
			return 'Invalid symbol.';
		default:
			return 'An error has occurred, try again later.';
	}
};
