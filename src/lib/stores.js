import { writable } from 'svelte/store';
export const landingForm = writable('registration');
export const activeComponent = writable('overview');
export const user = writable({ name: 'user', cash: 0, portfolio: [] });
