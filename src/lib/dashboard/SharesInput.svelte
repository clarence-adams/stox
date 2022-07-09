<script>
	import Input from '$lib/Input.svelte';

	const sharesInputPattern = '^[1-9][0-9]*$';
	const sharesInputRegex = new RegExp(sharesInputPattern);

	let sharesInputValue;

	// modifies input so user can only input numbers above 0
	const sharesInputHandler = () => {
		if (!sharesInputRegex.test(sharesInputValue)) {
			sharesInputValue = null;
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
	pattern={sharesInputPattern}
	required
/>
