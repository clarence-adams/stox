<script context="module">
	export async function load({ fetch }) {
		// fetch user data from database and return up to date data
		const res = await fetch('/dashboard/api/get-user');
		return {
			props: {
				userData: res.ok && (await res.json())
			}
		};
	}
</script>

<script>
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores.js';
	import Button from '$lib/Button.svelte';
	import Navbar from '$lib/dashboard/Navbar.svelte';

	export let userData;
	user.set(userData);

	const logout = () => {
		console.log('logged out');
		fetch('/api/logout', { method: 'GET' }).then((res) => goto(res.url));
	};
</script>

<main class="flex min-h-screen flex-col bg-gray-100 sm:flex-row">
	<!-- nav / controls -->
	<div class="fixed z-50 w-full border-r-2 border-gray-200 bg-white sm:h-full sm:w-52">
		<div class="flex items-center justify-between bg-emerald-300 p-4">
			<a href="/" class="mr-4 text-3xl font-bold">Stox</a>
			<Button onClick={logout} red>Logout</Button>
		</div>
		<p class="bg-emerald-200 p-4 text-3xl font-bold">
			{`$${parseInt($user.cash).toLocaleString()}`}
		</p>
		<Navbar />
	</div>
	<!-- content -->
	<div
		class="relative mt-40 min-h-screen flex-grow overflow-x-auto px-4 pt-4 pb-20 sm:mt-0 sm:ml-52 sm:w-[calc(100%-9rem)] sm:py-4 sm:px-8"
	>
		<slot />
	</div>
</main>
