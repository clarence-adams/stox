<script>
	import { user } from '$lib/stores.js';
	import { fly } from 'svelte/transition';
	import Table from '$lib/dashboard/Table.svelte';
	import TablePlaceholder from '$lib/dashboard/TablePlaceholder.svelte';

	const headers = ['Symbol', 'Shares', 'Average Cost', 'Transaction Date'];
	let flyDelay = 400;
	let flyDuration = 200;
	let flyY = 100;
</script>

{#if $user.purchases.length < 1}
	<TablePlaceholder>
		<p>After you've made your first purchase, they will show up here!</p>
	</TablePlaceholder>
{:else}
	<div
		in:fly={{ delay: flyDelay, duration: flyDuration, y: flyY }}
		out:fly={{ duration: flyDuration, y: flyY }}
	>
		<Table {headers}>
			{#each $user.purchases as purchase}
				<tr class="border-gray-150 border-t-2">
					<td class="px-4 py-2">{purchase.symbol.toUpperCase()}</td>
					<td class="px-4 py-2 text-right">{purchase.shares}</td>
					<td class="px-4 py-2 text-right">${purchase.price}</td>
					<td class="px-4 py-2 text-right">{purchase.datetime}</td>
				</tr>
			{/each}
		</Table>
	</div>
{/if}
{#if $user.sales.length < 1}
	<TablePlaceholder>
		<p>After you've made your first sale, they will show up here!</p>
	</TablePlaceholder>
{:else}
	<div
		in:fly={{ delay: flyDelay, duration: flyDuration, y: flyY }}
		out:fly={{ duration: flyDuration, y: flyY }}
	>
		<Table {headers}>
			{#each $user.sales as sale}
				<tr class="border-gray-150 border-t-2">
					<td class="px-4 py-2">{sale.symbol.toUpperCase()}</td>
					<td class="px-4 py-2 text-right">{sale.shares}</td>
					<td class="px-4 py-2 text-right">${sale.price}</td>
					<td class="px-4 py-2 text-right">{sale.datetime}</td>
				</tr>
			{/each}
		</Table>
	</div>
{/if}
