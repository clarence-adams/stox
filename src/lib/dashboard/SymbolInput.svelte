<script>
	import Input from '$lib/Input.svelte';

	const symbolInputRegex = /^[a-zA-Z]*$/;

	let symbolInputValue;

	// modifies input so user can only input letters
	const symbolInputHandler = () => {
		const regexTest = symbolInputRegex.test(symbolInputValue);

		if (regexTest === true) {
			symbolInputValue = symbolInputValue.toUpperCase();
		} else {
			symbolInputValue = symbolInputValue.slice(0, symbolInputValue.length - 1);
		}
	};
</script>

<Input
	id="symbol"
	name="symbol"
	label="Symbol"
	bind:value={symbolInputValue}
	onInput={symbolInputHandler}
	required
/>
