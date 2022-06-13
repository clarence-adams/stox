<script>
	export let type = 'text';
	export let disabled = false;
	export let required = false;
	export let value = '';
	export let onInput;
	export let error = false;
	export let subtext;

	let mb = subtext ? 'mb-0' : 'mb-4';

	const handleInput = (event) => {
		// allows value to be two way binding and type to be dynamic
		value = type.match(/^(number|range)$/) ? +event.target.value : event.target.value;
	};
</script>

<input
	{type}
	{disabled}
	{value}
	{...$$restProps}
	on:input={handleInput}
	on:input={onInput}
	style:border-color={required && value === '' && error === false
		? '#D1D5DB'
		: error === true
		? '#FB7185'
		: ''}
	class={`
  	w-full ${mb} px-1 py-px bg-transparent border-2 border-gray-300 
    rounded-lg last:mb-0 valid:border-emerald-300 invalid:border-rose-400
  `}
/>
{#if subtext}
	<p class="mb-4 pl-2 text-sm text-gray-600 last:mb-0">{subtext}</p>
{/if}
