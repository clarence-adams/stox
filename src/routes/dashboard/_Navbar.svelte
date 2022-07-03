<script>
	import { activeComponent, settingsOpen } from '$lib/stores';

	const buttons = ['news', 'quote', 'buy', 'sell', 'history'];

	const clickHandler = (button) => {
		activeComponent.set(button);
		settingsOpen.set(false);
	};
</script>

<nav
	class="fixed bottom-0 left-0 z-50 flex w-full flex-row justify-center bg-white dark:bg-gray-800 sm:static sm:flex-col sm:justify-start"
>
	{#each buttons as button}
		<button
			id={button}
			on:click={() => clickHandler(button)}
			class={`
				text-md bg-white p-4 text-center text-md font-bold hover:bg-gray-100 
				dark:hover:bg-gray-700 sm:text-left sm:text-2xl
				${
					$activeComponent === button
						? 'bg-emerald-100 dark:bg-gray-800 dark:border-b-4 dark:sm:border-r-4 dark:sm:border-b-0 dark:border-emerald-100'
						: 'dark:bg-gray-800'
				}
			`}
		>
			<span
				class={`block ${
					$activeComponent === button
						? 'dark:transform dark:translate-y-0.5 dark:sm:transform-none'
						: 'mt-0'
				}`}
			>
				{button.charAt(0).toUpperCase() + button.slice(1)}
			</span>
		</button>
	{/each}
</nav>
