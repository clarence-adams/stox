<script>
	import { session } from '$app/stores.js';
	import { activeComponent } from '$lib/stores.js';
	import Portfolio from '$lib/dashboard/Portfolio.svelte';
	import Overview from '$lib/dashboard/Overview.svelte';
	import Quote from '$lib/dashboard/Quote.svelte';
	import Buy from '$lib/dashboard/Buy.svelte';
	import Sell from '$lib/dashboard/Sell.svelte';

	const user = $session.user;
	const portfolio = [];
</script>

<section class="flex flex-col gap-16">
	<!-- welcome message -->
	<h1 class="text-3xl font-bold">Welcome, {user.name}!</h1>

	<!-- current portfolio -->
	<Portfolio {portfolio} />

	<svelte:component
		this={$activeComponent === 'overview'
			? Overview
			: $activeComponent === 'quote'
			? Quote
			: $activeComponent === 'buy'
			? Buy
			: Sell}
	/>
</section>
