<script>
	export let href;
	export let target;
	export let onClick;

	let classes = `
		px-3 py-1.5 font-semibold bg-emerald-300 border-2 border-emerald-300 
		rounded-lg hover:bg-emerald-400
	`;
</script>

{#if href === undefined}
	<button class={classes} on:click={onClick}><slot /></button>
{:else}
	<a {href} {target} class={'inline-block ' + classes}><slot /></a>
{/if}
