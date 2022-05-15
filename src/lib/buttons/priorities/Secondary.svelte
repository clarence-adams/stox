<script>
	export let href;
	export let target;
</script>

{#if href === undefined}
	<button class="border-2 border-emerald-300"><slot /></button>
{:else}
	<a {href} {target} class="inline-block border-2 border-emerald-300"><slot /></a>
{/if}
