<script>
	import { fly } from 'svelte/transition';

	export let onSubmit;
	export let form;

	let flyDelay = 400;
	let flyDuration = 200;
	let flyY = 100;
</script>

<form
	on:submit|preventDefault={onSubmit}
	bind:this={form}
	in:fly|local={{ delay: flyDelay, duration: flyDuration, y: flyY }}
	out:fly|local={{ duration: flyDuration, y: flyY }}
	class="
    mt-9 flex w-[300px] flex-shrink-0 flex-col gap-8 
    rounded-xl bg-white p-8 shadow
  "
>
	<slot />
</form>
