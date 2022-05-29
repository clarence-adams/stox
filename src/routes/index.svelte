<script context="module">
	export const prerender = true;
</script>

<script>
	import { registrationForm } from '$lib/stores';
	import BackgroundSvg from '$lib/landing/BackgroundSvg.svelte';
	import RegistrationForm from '$lib/landing/RegistrationForm.svelte';
	import LogInForm from '$lib/landing/LogInForm.svelte';

	let form = RegistrationForm;
	let register = true;
	let login = false;

	registrationForm.subscribe((newValue) => {
		if (newValue) {
			login = false;
			setTimeout(() => {
				register = true;
			}, 400);
		} else {
			register = false;
			setTimeout(() => {
				login = true;
			}, 400);
		}
	});
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

	{#if register}
		<RegistrationForm />
	{:else if login}
		<LogInForm />
	{/if}
</section>
