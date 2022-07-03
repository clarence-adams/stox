<script>
	export let href;
	export let target;
	export let onClick;
	export let red;

	let classes = `
		px-3 py-1.5 font-semibold border-2 bg-white rounded-lg bg-transparent hover:bg-black/5 dark:hover:bg-black/25
	`;
	let borderColor = red ? 'border-rose-400 ' : 'border-emerald-300 ';
</script>

{#if href === undefined}
	<button class={borderColor + classes} on:click={onClick}><slot /></button>
{:else}
	<a {href} {target} class={borderColor + 'inline-block ' + classes}><slot /></a>
{/if}
