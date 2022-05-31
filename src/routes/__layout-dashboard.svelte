<script>
	import { cash } from '$lib/stores.js';

	const formattedCash = `$${parseInt($cash).toLocaleString()}`;
</script>

<header class="h-16 w-full bg-emerald-300 px-4">
	<nav class="flex h-full items-center justify-between">
		<a href="/" class="text-3xl font-bold">Stox</a>
		<div class="flex gap-4">
			<p>Account Settings</p>
		</div>
	</nav>
</header>

<main class="flex flex-col bg-gray-50 sm:flex-row">
	<!-- left bar -->
	<div id="left-bar" class="border-r-2 border-gray-200 bg-white">
		<p class="bg-emerald-200 p-4 text-3xl font-bold">{formattedCash}</p>
		<p class="bg-emerald-100 p-4 text-2xl font-bold">Overview</p>
	</div>
	<!-- content -->
	<div class="py-4 px-8">
		<slot />
	</div>
</main>

<style>
	main {
		min-height: calc(100vh - 4rem);
	}
</style>
