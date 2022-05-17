<script>
	import '../app.css';
	import { registrationForm } from '../stores.js';
	import Button from '$lib/Button.svelte';

	const logInButtonHandler = () => {
		registrationForm.update((current) => !current);
	};
</script>

<header class="w-full h-16 px-8 bg-gray-50">
	<nav class="flex justify-between items-center h-full">
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

<main class="p-8 bg-gray-50">
	<slot />
</main>

<style>
	main {
		min-height: calc(100vh - 4rem);
	}
</style>
