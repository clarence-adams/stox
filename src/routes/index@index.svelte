<script context="module">
	export const prerender = true;
</script>

<script>
	import { landingForm } from '$lib/stores';
	import BackgroundSvg from '$lib/landing/BackgroundSvg.svelte';
	import RegistrationForm from '$lib/landing/RegistrationForm.svelte';
	import ForgotPasswordForm from '$lib/landing/ForgotPasswordForm.svelte';
	import LogInForm from '$lib/landing/LogInForm.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Stox" />
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

<BackgroundSvg />
<section class="relative z-10 flex flex-col items-center gap-16">
	<h1 class="flex flex-col items-center gap-4 text-5xl font-bold">
		<div>Quote</div>
		<div>Buy</div>
		<div>Sell</div>
		<div>Stox</div>
	</h1>

	<div class="grid grid-cols-1 grid-rows-1">
		{#if $landingForm === 'registration'}
			<RegistrationForm />
		{:else if $landingForm === 'login'}
			<LogInForm />
		{:else if $landingForm === 'forgotPassword'}
			<ForgotPasswordForm />
		{/if}
	</div>
</section>
