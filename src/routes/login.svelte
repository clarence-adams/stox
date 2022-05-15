<script context="module">
	export const prerender = true;
</script>

<script>
	import LogInForm from '$lib/LogInForm.svelte';
</script>

<section class="flex flex-col items-center gap-16">
	<h1 class="text-center text-5xl font-bold">Sign In</h1>

	<LogInForm />
</section>
