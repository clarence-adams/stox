<script>
	export let portfolio;
</script>

{#if portfolio.length < 1}
	<div class="rounded-xl bg-white p-4 text-lg shadow">
		<p>You don't have any positons in any stocks yet!</p>
		<p>Go buy some stocks and come back to see your current positions.</p>
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
					<td>{position.symbol}</td>
					<td>{position.shares}</td>
					<td>{position.averageCost}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
