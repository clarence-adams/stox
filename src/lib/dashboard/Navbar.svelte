<script>
	import { activeComponent } from '$lib/stores';

	const buttons = ['overview', 'quote', 'buy', 'sell'];

	const clickHandler = (button) => {
		activeComponent.set(button);
	};
</script>

<nav class="flex flex-col">
	{#each buttons as button}
		<button
			id={button}
			on:click={() => clickHandler(button)}
			style:background-color={$activeComponent === button ? '#D1FAE5' : ''}
			class="bg-white p-4 text-left text-2xl font-bold hover:bg-gray-100"
		>
			{button.charAt(0).toUpperCase() + button.slice(1)}
		</button>
	{/each}
</nav>
