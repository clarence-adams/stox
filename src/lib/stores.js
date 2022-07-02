import { browser } from '$app/env';
import { writable } from 'svelte/store';

export const landingForm = writable('registration');

export const activeComponent = writable('overview');

let currentTheme;
if (browser) {
	currentTheme = localStorage.theme;
}
export const theme = writable(currentTheme);
// when store changes, save the theme to localStorage
if (browser) theme.subscribe((value) => (localStorage.theme = value));

export const user = writable({ name: 'user', cash: 0, portfolio: [], purchases: [], sales: [] });
