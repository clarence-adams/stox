<script>
	import ThemeButton from '$lib/ThemeButton.svelte';
	import Input from '$lib/Input.svelte';
	import { fly } from 'svelte/transition';

	let flyDelay = 400;
	let flyDuration = 200;
	let flyY = 100;
</script>

<section
	in:fly|local={{ delay: flyDelay, duration: flyDuration, y: flyY }}
	out:fly|local={{ duration: flyDuration, y: flyY }}
	class="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-8"
>
	<h2 class="text-xl font-bold">Settings</h2>
	<hr class="my-4" />
	<ThemeButton />
</section>
