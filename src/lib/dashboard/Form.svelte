<script>
	export let onSubmit;
	export let form;
</script>

<form
	on:submit|preventDefault={onSubmit}
	bind:this={form}
	class="
    flex w-[300px] flex-col gap-8 rounded-xl bg-white 
    p-8 shadow-lg sm:w-[350px]
  "
>
	<slot />
</form>
