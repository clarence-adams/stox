<script>
	import H2 from '$lib/dashboard/H2.svelte';
	import Table from '$lib/dashboard/Table.svelte';
	import TablePlaceholder from '$lib/dashboard/TablePlaceholder.svelte';
	import { fly } from 'svelte/transition';

	export let portfolio;

	const headers = ['Symbol', 'Shares', 'Average Cost'];
	let flyDelay = 400;
	let flyDuration = 200;
	let flyY = 100;
</script>

<section
	in:fly|local={{ delay: flyDelay, duration: flyDuration, y: flyY }}
	out:fly|local={{ duration: flyDuration, y: flyY }}
>
	<H2>Portfolio</H2>
	{#if portfolio === undefined || portfolio.length < 1}
		<TablePlaceholder>
			<p>You don't have a position in any stocks yet!</p>
			<p>Go buy some stocks and come back to see your positions.</p>
		</TablePlaceholder>
	{:else}
		<Table {headers}>
			{#each portfolio as position}
				<tr class="border-gray-150 border-t-2 dark:border-gray-700">
					<td class="px-4 py-2">{position.symbol.toUpperCase()}</td>
					<td class="px-4 py-2 text-right">{position.shares}</td>
					<td class="px-4 py-2 text-right">${position.averageCost}</td>
				</tr>
			{/each}
		</Table>
	{/if}
</section>
