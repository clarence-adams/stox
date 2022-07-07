<script>
	import { slide } from 'svelte/transition';

	export let errors = [];
	export let noGap = false;

	const delay = 250;
	const duration = 250;
	const my = noGap ? '-my-4' : 'my-0';
</script>

<div class={my}>
	{#if errors.length > 0}
		<div
			transition:slide|local={{ delay: delay, duration: duration }}
			class="rounded-lg border-2 border-rose-400 bg-rose-200 p-4 dark:text-gray-900"
		>
			{#each errors as error}
				<p transition:slide|local={{ delay: delay, duration: duration }}>
					{error}
				</p>
			{/each}
		</div>
	{/if}
</div>
