<script context="module">
	export const prerender = true;
</script>

<script>
	import { registrationForm } from '../stores';
	import BackgroundSvg from '$lib/BackgroundSvg.svelte';
	import RegistrationForm from '$lib/RegistrationForm.svelte';
	import LogInForm from '$lib/LogInForm.svelte';

	let form = RegistrationForm;

	registrationForm.subscribe((newValue) => {
		if (newValue) {
			form = RegistrationForm;
		} else {
			form = LogInForm;
		}
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Stox" />
</svelte:head>

<BackgroundSvg />
<section class="relative flex flex-col items-center gap-16 z-10">
	<h1 class="flex flex-col items-center gap-4 text-5xl font-bold">
		<div>Quote</div>
		<div>Buy</div>
		<div>Sell</div>
		<div>Stox</div>
	</h1>

	<svelte:component this={form} />
</section>
