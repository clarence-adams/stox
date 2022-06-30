<script context="module">
	export async function load({ fetch }) {
		// fetch user data from database and return up to date data
		const res = await fetch('/api/dashboard/get-user');
		return {
			props: {
				userData: res.ok && (await res.json())
			}
		};
	}
</script>

<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores.js';
	import setTheme from '$lib/setTheme.js';
	import Button from '$lib/Button.svelte';
	import Navbar from '$lib/dashboard/Navbar.svelte';

	onMount(() => {
		setTheme();
	});

	export let userData;
	user.set(userData);

	const logout = () => {
		console.log('logged out');
		fetch('/api/dashboard/logout', { method: 'GET' }).then((res) => goto(res.url));
	};
</script>

<main
	class="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-100 sm:flex-row"
>
	<!-- nav / controls -->
	<div
		class="fixed z-50 flex h-28 w-full flex-col border-r-2 border-gray-200 bg-white dark:border-gray-900 dark:bg-gray-800 sm:block sm:h-full sm:w-52"
	>
		<div
			class="flex flex-grow items-center justify-between bg-emerald-300 px-4 py-2 dark:text-gray-900 sm:p-4"
		>
			<p href="/" class="mr-4 text-3xl font-bold">Stox</p>
			<Button onClick={logout} red>Logout</Button>
		</div>
		<p class="flex-grow bg-emerald-200 py-2 px-4 text-3xl font-bold dark:text-gray-900 sm:p-4">
			{`$${parseInt($user.cash).toLocaleString()}`}
		</p>
		<Navbar />
	</div>
	<!-- content -->
	<div
		class="relative mt-28 min-h-screen w-full px-4 pt-8 pb-20 sm:fixed sm:left-52 sm:top-0 sm:mt-0 sm:max-w-[calc(100%-theme(spacing.52))] sm:py-8 sm:px-8"
	>
		<slot />
	</div>
</main>
