<script>
	import '../app.css';
	import { registrationForm } from '$lib/stores.js';
	import Button from '$lib/Button.svelte';

	const logInButtonHandler = () => {
		registrationForm.update((current) => !current);
	};
</script>

<header class="h-16 w-full bg-gray-100 px-8 sm:px-16">
	<nav class="flex h-full items-center justify-between">
		<a href="/" class="text-3xl font-bold">Stox</a>
		<div class="flex gap-4">
			<Button buttonType="secondary" href="">Guest Sign In</Button>
			{#if $registrationForm}
				<Button buttonType="primary" onClick={logInButtonHandler}>Log In</Button>
			{:else}
				<Button buttonType="primary" onClick={logInButtonHandler}>Register</Button>
			{/if}
		</div>
	</nav>
</header>

<main class="bg-gray-100 p-8 sm:px-16">
	<slot />
</main>

<style>
	main {
		min-height: calc(100vh - 4rem);
	}
</style>
