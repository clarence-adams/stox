import { writable } from 'svelte/store';
export const registrationForm = writable(true);
export const activeComponent = writable('overview');
export const user = writable({ name: 'user', cash: 0, portfolio: [] });
