<script>
	export let headers = [];
</script>

<table class="w-full rounded-lg bg-white shadow sm:w-96">
	<thead>
		{#each headers as header}
			<th class="p-4">{header}</th>
		{/each}
	</thead>
	<tbody>
		<slot />
	</tbody>
</table>
