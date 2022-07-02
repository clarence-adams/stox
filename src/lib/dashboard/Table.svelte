<script>
	export let headers = [];
</script>

<div class="flex overflow-x-auto rounded-lg bg-white pl-4 shadow dark:bg-gray-800">
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
	<div class="w-4 flex-shrink-0" />
</div>
