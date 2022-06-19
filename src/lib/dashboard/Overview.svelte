<script>
	import H2 from '$lib/dashboard/H2.svelte';
	import { user } from '$lib/stores.js';
	import { fly } from 'svelte/transition';
	import Table from '$lib/dashboard/Table.svelte';
	import TablePlaceholder from '$lib/dashboard/TablePlaceholder.svelte';

	const headers = ['Symbol', 'Shares', 'Price', 'Total', 'Date'];
	const padding = 'px-2 sm:px-4 py-2';
	let flyDelay = 400;
	let flyDuration = 200;
	let flyY = 100;
</script>

<section class="flex flex-col gap-8 xl:flex-row">
	<!-- purchases -->
	<div
		in:fly|local={{ delay: flyDelay, duration: flyDuration, y: flyY }}
		out:fly|local={{ duration: flyDuration, y: flyY }}
	>
		<H2>Recent Purchases</H2>
		{#if $user.purchases.length < 1}
			<TablePlaceholder>
				<p>After you've made your first purchase, they will show up here!</p>
			</TablePlaceholder>
		{:else}
			<Table {headers}>
				{#each $user.purchases as purchase}
					<tr class="border-gray-150 border-t-2">
						<td class={padding}>{purchase.symbol.toUpperCase()}</td>
						<td class="{padding} text-right">{purchase.shares}</td>
						<td class="{padding} text-right">${purchase.price}</td>
						<td class="{padding} text-right">${purchase.shares * purchase.price}</td>
						<td class="{padding} text-right">{purchase.datetime.substring(0, 10)}</td>
					</tr>
				{/each}
			</Table>
		{/if}
	</div>

	<!-- sales -->
	<div
		in:fly|local={{ delay: flyDelay, duration: flyDuration, y: flyY }}
		out:fly|local={{ duration: flyDuration, y: flyY }}
	>
		<H2>Recent Sales</H2>
		{#if $user.sales.length < 1}
			<TablePlaceholder>
				<p>After you've made your first sale, they will show up here!</p>
			</TablePlaceholder>
		{:else}
			<Table {headers}>
				{#each $user.sales as sale}
					<tr class="border-gray-150 border-t-2">
						<td class={padding}>{sale.symbol.toUpperCase()}</td>
						<td class="{padding} text-right">{sale.shares}</td>
						<td class="{padding} text-right">${sale.price}</td>
						<td class="{padding} text-right">${sale.shares * sale.price}</td>
						<td class="{padding} text-right">{sale.datetime.substring(0, 10)}</td>
					</tr>
				{/each}
			</Table>
		{/if}
	</div>
</section>
