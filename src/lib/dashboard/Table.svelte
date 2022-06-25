<script>
	export let headers = [];
</script>

<div class="w-full overflow-x-auto rounded-lg bg-white p-4 px-4 shadow">
	<table class="w-full">
		<thead>
			{#each headers as header}
				<th class="py-4 px-2 sm:px-4">{header}</th>
			{/each}
		</thead>
		<tbody>
			<slot />
		</tbody>
	</table>
</div>
