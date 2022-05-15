<script context="module">
	export const prerender = true;
</script>

<script>
	import BackgroundSvg from '$lib/BackgroundSvg.svelte';
	import SignUpForm from '$lib/SignUpForm.svelte';
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

	<SignUpForm />
</section>
