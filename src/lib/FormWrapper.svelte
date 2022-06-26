<script>
	import { fly } from 'svelte/transition';

	let flyDelay = 400;
	let flyDuration = 200;
	let flyY = 100;
</script>

<div
	in:fly|local={{ delay: flyDelay, duration: flyDuration, y: flyY }}
	out:fly|local={{ duration: flyDuration, y: flyY }}
	class="w-[300px] rounded-xl bg-white p-8 shadow dark:bg-gray-800 dark:text-gray-100 sm:w-[350px]"
>
	<slot />
</div>
