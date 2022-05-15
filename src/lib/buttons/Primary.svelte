<script>
	export let href;
	export let target;

	let classes = 'px-3 py-1.5 font-semibold bg-emerald-300 border-2 border-emerald-300 rounded-xl';
</script>

{#if href === undefined}
	<button class={classes}><slot /></button>
{:else}
	<a {href} {target} class={'inline-block ' + classes}><slot /></a>
{/if}
