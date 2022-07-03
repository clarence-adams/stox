import { browser } from '$app/env';
import { writable, derived } from 'svelte/store';

export const landingForm = writable('registration');

export const activeComponent = writable('news');

let currentTheme;
if (browser) {
	currentTheme = localStorage.theme;
}
export const theme = writable(currentTheme);
// when store changes, save the theme to localStorage
if (browser) theme.subscribe((value) => (localStorage.theme = value));

export const user = writable({ name: 'user', cash: 0, portfolio: [], purchases: [], sales: [] });

export const news = derived(user, async ($user, set) => {
	// if user has no positions, don't try to fetch news
	if ($user.portfolio.length < 1) {
		set(null);
	} else {
		const portfolio = $user.portfolio
			.slice(0, 3)
			.map((e) => {
				return e.symbol.toUpperCase();
			})
			.join(',');
		const url = `/api/dashboard/get-news?symbols=${portfolio}`;
		const newsRes = await fetch(url);
		let newsData;
		if (newsRes.ok) {
			newsData = await newsRes.json();
		} else {
			newsData = 'error';
		}
		set(newsData);
	}
});

export const settingsOpen = writable(false);
