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
	import { goto } from '$app/navigation';
	import { user, news } from '$lib/stores';
	import Button from '$lib/Button.svelte';
	import Navbar from './_Navbar.svelte';

	export let userData;

	if (userData) {
		user.set(userData);
	}

	const logout = () => {
		fetch('/api/dashboard/logout', { method: 'GET' }).then((res) => goto(res.url));
	};
</script>

<main
	class="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-100 sm:flex-row"
>
	<!-- nav / controls -->
	<div
		class="fixed z-50 flex h-28 w-full flex-col border-r-2 border-gray-200 bg-white dark:border-gray-900 dark:bg-gray-800 sm:block sm:h-full sm:w-56"
	>
		<div
			class="flex flex-grow items-center justify-between bg-emerald-300 px-4 py-2 dark:text-gray-900 sm:p-4"
		>
			<p href="/" class="mr-4 text-3xl font-bold">Stox</p>
			<Button onClick={logout} red>
				Logout
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="inline"
					viewBox="0 0 16 16"
				>
					<path
						fill-rule="evenodd"
						d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"
					/>
					<path
						fill-rule="evenodd"
						d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
					/>
				</svg>
			</Button>
		</div>
		<p class="flex-grow bg-emerald-200 py-2 px-4 text-3xl font-bold dark:text-gray-900 sm:p-4">
			{`$${parseFloat($user.cash).toLocaleString()}`}
		</p>
		<Navbar />
	</div>
	<!-- content -->
	<div
		class="relative mt-28 min-h-screen w-full px-4 pt-8 pb-20 sm:left-56 sm:top-0 sm:mt-0 sm:max-w-[calc(100%-theme(spacing.56))] sm:py-8 sm:px-8"
	>
		<slot />
	</div>
</main>
