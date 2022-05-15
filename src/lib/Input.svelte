<script>
	export let name;
	export let id;
	export let type;
	export let disabled;
</script>

<input
	{name}
	{id}
	{type}
	{disabled}
	class="
    w-full px-1 py-px mb-4 bg-transparent border-2 border-gray-300 
    rounded-xl last:mb-0
  "
/>
