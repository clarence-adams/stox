<script>
	import Primary from '$lib/buttons/priorities/Primary.svelte';
	import Secondary from '$lib/buttons/priorities/Secondary.svelte';

	export let href;
	export let target;
	export let priority;

	let component;

	if (priority === 'primary' || !priority) {
		component = Primary;
	} else if (priority === 'secondary') {
		component = Secondary;
	}
</script>

<svelte:component this={component} {href} {target}><slot /></svelte:component>
