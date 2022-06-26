<script>
	import { fly } from 'svelte/transition';

	export let onSubmit;
	export let form;
	export let header;

	let flyDelay = 400;
	let flyDuration = 200;
	let flyY = 100;
</script>

<div
	in:fly|local={{ delay: flyDelay, duration: flyDuration, y: flyY }}
	out:fly|local={{ duration: flyDuration, y: flyY }}
>
	{#if header !== undefined}
		<h2 class="mb-2 text-lg font-bold">{header}</h2>
	{/if}
	<form
		on:submit|preventDefault={onSubmit}
		bind:this={form}
		class="
    flex w-[300px] flex-col gap-8 
    rounded-lg bg-white p-8 shadow dark:bg-gray-800
  "
	>
		<slot />
	</form>
</div>
