<script>
	export let href;
	export let target;

	let classes = 'font-semibold underline decoration-2 hover:decoration-emerald-300';
</script>

{#if href === undefined}
	<button class={classes}><slot /></button>
{:else}
	<a {href} {target} class={'inline-block ' + classes}><slot /></a>
{/if}
