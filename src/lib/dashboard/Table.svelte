<script>
	export let headers = [];
</script>

<table class="text-md w-full overflow-x-auto rounded-lg bg-white shadow sm:text-lg">
	<thead>
		{#each headers as header}
			<th class="py-4 px-2 sm:px-4">{header}</th>
		{/each}
	</thead>
	<tbody>
		<slot />
	</tbody>
</table>
