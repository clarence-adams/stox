<script>
	import { landingForm } from '$lib/stores';
	import ThemeButton from '$lib/ThemeButton.svelte';
	import Button from '$lib/Button.svelte';

	const logInButtonHandler = () => {
		landingForm.set('login');
	};

	const registerButtonHandler = () => {
		landingForm.set('registration');
	};
</script>

<header
	class="h-16 w-full border-b-2 bg-white px-8 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100 sm:px-16"
>
	<nav class="flex h-full items-center justify-between">
		<a href="/" class="text-3xl font-bold">Stox</a>
		<div class="flex gap-4">
			<!-- <Button buttonType="secondary" href="">Guest Sign In</Button> -->
			{#if $landingForm === 'registration'}
				<Button buttonType="primary" onClick={logInButtonHandler}>Log In</Button>
			{:else if $landingForm === 'login' || $landingForm === 'forgotPassword'}
				<Button buttonType="primary" onClick={registerButtonHandler}>Register</Button>
			{/if}
			<ThemeButton />
		</div>
	</nav>
</header>

<main class="bg-gray-100 p-8 dark:bg-gray-900 dark:text-gray-100 sm:px-16">
	<slot />
</main>

<style>
	main {
		min-height: calc(100vh - 4rem);
	}
</style>
