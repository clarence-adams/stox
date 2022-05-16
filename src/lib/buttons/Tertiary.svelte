<script>
	export let href;
	export let target;
	export let onClick;
	export let type;

	let classes = `
		font-semibold underline decoration-2 hover:decoration-emerald-300
	`;
</script>

{#if href === undefined}
	<button {type} class={classes} on:click={onClick}><slot /></button>
{:else}
	<a {href} {target} class={'inline-block ' + classes}><slot /></a>
{/if}
