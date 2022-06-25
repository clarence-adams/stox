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
