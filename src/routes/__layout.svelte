<script>
	import '../app.css';
	import Button from '$lib/buttons/Button.svelte';
</script>

<header class="flex justify-between items-center w-full h-16 px-8">
	<p class="text-3xl font-bold">Stox</p>
	<nav>
		<Button priority="secondary">Secondary</Button>
		<Button priority="primary" href="">Button</Button>
	</nav>
</header>

<main class="p-8">
	<slot />
</main>
