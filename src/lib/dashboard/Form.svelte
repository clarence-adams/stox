<script>
	import CardWrapper from '$lib/CardWrapper.svelte';

	export let onSubmit;
	export let form;
	export let header;
</script>

<CardWrapper {header}>
	<form
		on:submit|preventDefault={onSubmit}
		bind:this={form}
		class="
    flex flex-col gap-8 
  "
	>
		<slot />
	</form>
</CardWrapper>
