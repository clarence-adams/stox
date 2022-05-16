<script>
	export let href;
	export let target;

	let classes = `
		px-3 py-1.5 font-semibold border-2 border-emerald-300 rounded-xl
		hover:bg-black/[.05]
	`;
</script>

{#if href === undefined}
	<button class={classes}><slot /></button>
{:else}
	<a {href} {target} class={'inline-block ' + classes}><slot /></a>
{/if}
