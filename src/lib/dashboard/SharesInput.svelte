<script>
	import Input from '$lib/Input.svelte';

	const sharesInputRegex = /^[1-9][0-9]*$|^$/;

	let sharesInputValue;

	// modifies input so user can only input numbers
	const sharesInputHandler = () => {
		const regexTest = sharesInputRegex.test(sharesInputValue);

		if (regexTest !== true) {
			sharesInputValue = 'error';
		}
	};
</script>

<Input
	id="shares"
	name="shares"
	label="Shares"
	type="number"
	bind:value={sharesInputValue}
	onInput={sharesInputHandler}
	required
/>
