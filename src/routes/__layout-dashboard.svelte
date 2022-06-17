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
	import Navbar from '$lib/dashboard/Navbar.svelte';
	import Button from '$lib/Button.svelte';

	export let userData;
	user.set(userData);

	const logout = () => {
		console.log('logged out');
		fetch('/api/logout', { method: 'GET' }).then((res) => goto(res.url));
	};
</script>

<main class="flex min-h-screen flex-col bg-gray-100 sm:flex-row">
	<!-- left bar -->
	<div id="left-bar" class="border-r-2 border-gray-200 bg-white">
		<div class="flex items-center justify-between bg-emerald-300 p-4">
			<a href="/" class="text-3xl font-bold">Stox</a>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				fill="currentColor"
				class="bi bi-gear-fill"
				viewBox="0 0 16 16"
			>
				<path
					d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"
				/>
			</svg>
		</div>
		<p class="bg-emerald-200 p-4 text-3xl font-bold">
			{`$${parseInt($user.cash).toLocaleString()}`}
		</p>
		<Navbar />
		<Button buttonType="secondary" onClick={logout}>Logout</Button>
	</div>
	<!-- content -->
	<div class="flex-grow py-4 px-8">
		<slot />
	</div>
</main>
