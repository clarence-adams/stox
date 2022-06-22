<script>
	import { activeComponent } from '$lib/stores.js';
	import { user } from '$lib/stores.js';
	import Portfolio from '$lib/dashboard/Portfolio.svelte';
	import Overview from '$lib/dashboard/Overview.svelte';
	import Quote from '$lib/dashboard/Quote.svelte';
	import Buy from '$lib/dashboard/Buy.svelte';
	import Sell from '$lib/dashboard/Sell.svelte';
</script>

<div class="flex flex-col gap-8 sm:gap-16">
	<!-- welcome message -->
	<h1 class="text-3xl font-bold">Welcome, {$user.name}!</h1>

	<div id="content-wrapper">
		<!-- current portfolio -->
		<Portfolio portfolio={$user.portfolio} />

		<svelte:component
			this={$activeComponent === 'overview'
				? Overview
				: $activeComponent === 'quote'
				? Quote
				: $activeComponent === 'buy'
				? Buy
				: Sell}
		/>
	</div>
</div>

<style>
	#content-wrapper {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: 1fr;
		gap: 2rem;
	}

	@media (min-width: 1024px) {
		#content-wrapper {
			grid-template-columns: 22rem minmax(0, 1fr);
		}
	}
</style>
