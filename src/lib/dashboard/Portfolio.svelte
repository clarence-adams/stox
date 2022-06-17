<script>
	import Table from '$lib/dashboard/Table.svelte';
	import TablePlaceholder from '$lib/dashboard/TablePlaceholder.svelte';

	export let portfolio;

	const headers = ['Symbol', 'Shares', 'Average Cost'];
</script>

{#if portfolio === undefined || portfolio.length < 1}
	<TablePlaceholder>
		<p>You don't have a position in any stocks yet!</p>
		<p>Go buy some stocks and come back to see your positions.</p>
	</TablePlaceholder>
{:else}
	<Table {headers}>
		{#each portfolio as position}
			<tr class="border-gray-150 border-t-2">
				<td class="px-4 py-2">{position.symbol.toUpperCase()}</td>
				<td class="px-4 py-2 text-right">{position.shares}</td>
				<td class="px-4 py-2 text-right">${position.averageCost}</td>
			</tr>
		{/each}
	</Table>
{/if}
