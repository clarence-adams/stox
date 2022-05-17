<script>
	export let name;
	export let id;
	export let type;
	export let disabled;
	export let required;
	export let minLength;
	export let maxLength;
	export let min;
	export let max;
	export let pattern;

	let value;
	let borderColor = '#D1D5DB';

	const inputHandler = (e) => {
		if (e.target.value === '') {
			borderColor = '#D1D5DB';
		} else {
			borderColor = '';
		}
	};
</script>

<input
	{name}
	{id}
	{type}
	{disabled}
	{required}
	{minLength}
	{maxLength}
	{min}
	{max}
	{pattern}
	on:input={inputHandler}
	style={`border-color: ${borderColor}`}
	class="
    w-full px-1 py-px mb-4 bg-transparent border-2 border-gray-300 
    rounded-xl last:mb-0 valid:border-emerald-300 invalid:border-rose-400
  "
/>
