<script>
	export let href;
	export let target;
</script>

{#if href === undefined}
	<button class="bg-emerald-300"><slot /></button>
{:else}
	<a {href} {target} class="inline-block bg-emerald-300"><slot /></a>
{/if}
