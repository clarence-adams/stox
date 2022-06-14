<script>
	export let portfolio;
</script>

{#if portfolio.length < 1}
	<div class="rounded-xl bg-white p-4 text-lg shadow">
		<p>You don't have a position in any stocks yet!</p>
		<p>Go buy some stocks and come back to see your positions.</p>
	</div>
{:else}
	<table>
		<thead>
			<th>Symbol</th>
			<th>Shares</th>
			<th>Average Cost</th>
		</thead>
		<tbody>
			{#each portfolio as position}
				<tr>
					<td>{position.symbol.toUpperCase()}</td>
					<td>{position.shares}</td>
					<td>{position.average_cost}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
