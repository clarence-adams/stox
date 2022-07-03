const apiToken = import.meta.env.VITE_MARKETAUX_API_TOKEN;

export const get = async (event) => {
	if (event.locals.user.name === 'Guest') {
		return { status: 401 };
	}
	const params = new URL(event.request.url).searchParams;
	const symbols = params.get('symbols');

	var apiUrl = `https://api.marketaux.com/v1/news/all?symbols=${symbols}&filter_entities=true&language=en&api_token=${apiToken}`;
	const res = await fetch(apiUrl);
	let news = null;
	if (res.ok) {
		news = await res.json();
	} else {
		return {
			status: 500
		};
	}

	return {
		status: 200,
		body: { news: news }
	};
};
