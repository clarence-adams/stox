<script>
	import { activeComponent } from '$lib/stores';

	const buttons = ['overview', 'quote', 'buy', 'sell'];

	const clickHandler = (button) => {
		activeComponent.set(button);
	};
</script>

<nav
	class="fixed bottom-0 left-0 z-50 flex w-full flex-row justify-center bg-white sm:static sm:flex-col sm:justify-start"
>
	{#each buttons as button}
		<button
			id={button}
			on:click={() => clickHandler(button)}
			style:background-color={$activeComponent === button ? '#D1FAE5' : ''}
			class="text-md bg-white p-4 text-center text-lg font-bold hover:bg-gray-100 sm:text-left sm:text-2xl"
		>
			{button.charAt(0).toUpperCase() + button.slice(1)}
		</button>
	{/each}
</nav>
