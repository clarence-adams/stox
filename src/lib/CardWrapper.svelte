<script>
	import { fly } from 'svelte/transition';
	import H2 from '$lib/dashboard/H2.svelte';

	export let header;
	export let fixedWidth = true;

	const width = fixedWidth ? 'w-[300px] sm:w-[350px]' : `w-full max-w-2xl`;

	let flyDelay = 400;
	let flyDuration = 200;
	let flyY = 100;
</script>

<div
	in:fly|local={{ delay: flyDelay, duration: flyDuration, y: flyY }}
	out:fly|local={{ duration: flyDuration, y: flyY }}
>
	{#if header !== undefined}
		<H2>{header}</H2>
	{/if}
	<div class="{width} rounded-xl bg-white p-8 shadow dark:bg-gray-800 dark:text-gray-100">
		<slot />
	</div>
</div>
