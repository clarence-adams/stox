<script>
	import { activeComponent } from '$lib/stores';
	import { user, settingsOpen } from '$lib/stores';
	import Settings from './_Settings.svelte';
	import Portfolio from './_Portfolio.svelte';
	import News from './_News.svelte';
	import Quote from './_Quote.svelte';
	import Buy from './_Buy.svelte';
	import Sell from './_Sell.svelte';
	import History from './_History.svelte';

	let settingsHover = false;

	const openSettings = () => {
		settingsOpen.set($settingsOpen ? false : true);
	};

	const settingsMouseEnter = () => {
		settingsHover = true;
	};

	const settingsMouseLeave = () => {
		settingsHover = false;
	};
</script>

<svelte:head>
	<title>Dashboard</title>
	<meta name="description" content="Stox | Dashboard" />
	<script>
		// sets theme before body loads so that there is no theme flashing
		// same function as setTheme in src/lib
		if (document) {
			if (
				localStorage.theme === 'dark' ||
				(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
			) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	</script>
</svelte:head>

<div class="flex flex-col gap-8 sm:gap-16">
	<!-- welcome message / settings button -->
	<div
		class="flex items-center gap-4 rounded-lg bg-white py-8 px-4 shadow dark:bg-gray-800 sm:px-8"
	>
		<div>
			<h1 class="text-2xl font-bold sm:text-3xl">
				Welcome, {$user.name}!
			</h1>
			{#if $user.name === 'Guest'}
				<p class="mt-2 text-sm">
					You are in guest mode! Your data will be overwritten if another user logs into guest mode.
					Your session could end at anytime. To prevent these issues, logout of guest mode and
					create an account!
				</p>
			{/if}
		</div>
		<button
			on:click={openSettings}
			on:mouseenter={settingsMouseEnter}
			on:mouseleave={settingsMouseLeave}
		>
			{#if !settingsHover && !$settingsOpen}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="currentColor"
					viewBox="0 0 16 16"
				>
					<path
						d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"
					/>
					<path
						d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"
					/>
				</svg>
			{:else if settingsHover || $settingsOpen}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="currentColor"
					viewBox="0 0 16 16"
				>
					<path
						d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"
					/>
				</svg>
			{/if}
		</button>
	</div>

	{#if $settingsOpen}
		<Settings />
	{:else}
		<div id="content-wrapper">
			<!-- current portfolio -->
			<Portfolio portfolio={$user.portfolio} />

			<svelte:component
				this={$activeComponent === 'news'
					? News
					: $activeComponent === 'quote'
					? Quote
					: $activeComponent === 'buy'
					? Buy
					: $activeComponent === 'sell'
					? Sell
					: History}
			/>
		</div>
	{/if}
</div>

<style>
	#content-wrapper {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: 1fr;
		gap: 2rem;
	}

	@media (min-width: 1024px) {
		#content-wrapper {
			grid-template-columns: 22rem minmax(0, 1fr);
		}
	}
</style>
