<script>
	export let href;
	export let target;
	export let disabled;
	export let onClick;
	export let type;
	export let red;

	let classes = `
		px-3 py-1.5 font-semibold bg-emerald-300 border-2 border-emerald-300 
		rounded-lg text-black
	`;
	let bgColor = red ? 'bg-rose-300 ' : 'bg-emerald-300 ';
	let hoverBgColor = red ? ' hover:bg-rose-400' : ' hover:bg-emerald-400';
</script>

{#if href === undefined}
	<button class={bgColor + classes + hoverBgColor} on:click={onClick} {disabled} {type}
		><slot /></button
	>
{:else}
	<a {href} {target} class={bgColor + 'inline-block ' + classes + hoverBgColor}><slot /></a>
{/if}
