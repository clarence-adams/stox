<script>
	import Label from '$lib/Label.svelte';

	export let type = 'text';
	export let name;
	export let label = 'Label';
	export let disabled = false;
	export let required = false;
	export let value = '';
	export let onInput;
	export let onBlur;
	export let error = false;
	export let pattern;
	export let subtext;

	let regex;
	if (pattern) {
		regex = new RegExp(pattern);
	}

	let borderColor = 'border-gray-300 dark:border-gray-500';
	let mb = subtext ? 'mb-0' : 'mb-4';

	const handleInput = (event) => {
		// allows value to be two way binding and type to be dynamic
		value = type.match(/^(number|range)$/) ? +event.target.value : event.target.value;
		if (regex) {
			borderColor =
				required && value === ''
					? 'border-gray-300 dark:border-gray-500'
					: regex.test(value) || error === true
					? 'border-emerald-300'
					: 'border-rose-400';
		}
	};
</script>

<Label labelFor={name}>{label}</Label>
<input
	{type}
	{disabled}
	{value}
	{name}
	{pattern}
	{...$$restProps}
	on:input={handleInput}
	on:input={onInput}
	on:blur={onBlur}
	class={`
  	w-full ${mb} px-1 py-px bg-transparent border-2 rounded-lg ${borderColor}
		last:mb-0
  `}
/>
{#if subtext}
	<p class="mb-4 pl-2 text-sm text-gray-600 last:mb-0 dark:text-gray-200">{subtext}</p>
{/if}
