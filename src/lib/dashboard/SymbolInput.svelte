<script>
	import Input from '$lib/Input.svelte';

	const symbolInputPattern = '^[a-zA-Z]{1,5}$';
	const symbolInputRegex = new RegExp(symbolInputPattern);

	let symbolInputValue;

	// modifies input so user can only input letters
	const symbolInputHandler = () => {
		if (symbolInputRegex.test(symbolInputValue)) {
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
	pattern={symbolInputPattern}
	required
/>
