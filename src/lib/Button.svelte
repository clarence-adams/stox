<script>
	import Primary from '$lib/buttons/Primary.svelte';
	import Secondary from '$lib/buttons/Secondary.svelte';
	import Tertiary from '$lib/buttons/Tertiary.svelte';

	export let href;
	export let target;
	export let onClick;
	export let type;
	export let buttonType;
	export let disabled;

	let component;

	if (buttonType === 'primary' || !buttonType) {
		component = Primary;
	} else if (buttonType === 'secondary') {
		component = Secondary;
	} else if (buttonType === 'tertiary') {
		component = Tertiary;
	}
</script>

<svelte:component this={component} {href} {target} {type} {onClick} {disabled}>
	<slot />
</svelte:component>
